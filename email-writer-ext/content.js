// Keep track of editors we already processed
const processedEditors = new Set();

// Observe DOM changes (Gmail is dynamic)
const observer = new MutationObserver(() => {
    const editors = document.querySelectorAll('[role="textbox"][g_editable="true"]');

    editors.forEach(editor => {
        if (processedEditors.has(editor)) return;

        const toolbar = findToolbar(editor);

        if (toolbar) {
            injectButton(toolbar, editor);
            processedEditors.add(editor);
        }
    });
});

observer.observe(document.body, { childList: true, subtree: true });


// 🔍 Find toolbar for Compose + Reply
function findToolbar(editor) {
    // Compose window toolbar
    let toolbar = editor.closest('.M9')?.querySelector('.btC');
    if (toolbar) return toolbar;

    // Inline reply toolbar
    toolbar = editor.closest('div[role="dialog"]')?.querySelector('.btC');
    if (toolbar) return toolbar;

    // Fallback (sometimes Gmail changes structure)
    return editor.parentElement?.querySelector('.btC') || null;
}


// ➕ Inject AI button
function injectButton(toolbar, composeBox) {
    // Prevent duplicate button
    if (toolbar.querySelector('.ai-reply-btn')) return;

    const button = document.createElement('button');
    button.innerText = "AI Reply";
    button.className = "ai-reply-btn";

    // Styling
    button.style.marginLeft = "8px";
    button.style.padding = "6px 10px";
    button.style.backgroundColor = "#0b57d0";
    button.style.color = "white";
    button.style.border = "none";
    button.style.borderRadius = "4px";
    button.style.cursor = "pointer";
    button.style.fontSize = "12px";

    // Click handler
    button.onclick = async () => {
        button.innerText = "Generating...";
        button.disabled = true;

        try {
            const emailText = getEmailContent();

            if (!emailText) {
                alert("Could not detect email content");
                return;
            }

            const response = await fetch("http://localhost:8080/api/email/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    emailContent: emailText,
                    tone: "professional"
                })
            });

            const data = await response.text();

            insertReply(composeBox, data);

        } catch (error) {
            console.error(error);
            alert("Error generating reply");
        } finally {
            button.innerText = "AI Reply";
            button.disabled = false;
        }
    };

    toolbar.appendChild(button);
}


// 📩 Extract latest email content
function getEmailContent() {
    const emailBodies = document.querySelectorAll('.a3s.aiL');

    if (emailBodies.length === 0) return null;

    return emailBodies[emailBodies.length - 1].innerText;
}


// ✍️ Insert reply into compose box
function insertReply(composeBox, text) {
    composeBox.focus();

    // Modern safer approach
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(composeBox);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);

    document.execCommand("insertText", false, text);
}