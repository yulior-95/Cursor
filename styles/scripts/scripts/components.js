// 加载状态组件
export function LoadingSpinner({ size = 'md', color = 'primary' }) {
    const spinner = document.createElement('div');
    spinner.className = `spinner spinner-${size} spinner-${color}`;
    spinner.innerHTML = `
        <svg class="animate-spin" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    `;
    return spinner;
}

// 空状态组件
export function EmptyState({ message = '暂无数据', icon = '📭' }) {
    const empty = document.createElement('div');
    empty.className = 'flex flex-col items-center justify-center py-12';
    empty.innerHTML = `
        <div class="text-4xl mb-4">${icon}</div>
        <div class="text-gray-500 text-sm">${message}</div>
    `;
    return empty;
}

// 骨架屏组件
export function SkeletonLoader({ type = 'list', count = 3 }) {
    const skeleton = document.createElement('div');
    skeleton.className = 'animate-pulse';
    
    if (type === 'list') {
        skeleton.innerHTML = Array(count).fill(`
            <div class="p-4 border-b border-gray-100">
                <div class="flex items-center space-x-4">
                    <div class="w-12 h-12 rounded-lg bg-gray-200"></div>
                    <div class="flex-1 space-y-2">
                        <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    return skeleton;
}

// 确认弹窗组件
export function ConfirmDialog({ title, message, onConfirm, onCancel }) {
    const dialog = document.createElement('div');
    dialog.className = 'modal-overlay';
    dialog.innerHTML = `
        <div class="modal-content p-6">
            <h3 class="text-lg font-medium mb-4">${title}</h3>
            <p class="text-gray-500 mb-6">${message}</p>
            <div class="flex space-x-4">
                <button class="flex-1 py-2 bg-gray-100 rounded-lg" onclick="handleCancel()">取消</button>
                <button class="flex-1 py-2 bg-primary-500 text-white rounded-lg" onclick="handleConfirm()">确认</button>
            </div>
        </div>
    `;
    
    function handleConfirm() {
        onConfirm();
        dialog.remove();
    }
    
    function handleCancel() {
        onCancel?.();
        dialog.remove();
    }
    
    document.body.appendChild(dialog);
}

// 底部操作表组件
export function ActionSheet({ title, actions }) {
    const sheet = document.createElement('div');
    sheet.className = 'modal-overlay';
    sheet.innerHTML = `
        <div class="modal-content">
            <div class="p-4 text-center text-gray-500">${title}</div>
            ${actions.map(action => `
                <button class="w-full p-4 text-center border-t border-gray-100 ${action.danger ? 'text-red-500' : ''}" 
                        onclick="handleAction(${action.value})">
                    ${action.text}
                </button>
            `).join('')}
            <button class="w-full p-4 text-center border-t border-gray-100 mt-2" onclick="handleClose()">取消</button>
        </div>
    `;
    
    function handleAction(value) {
        const action = actions.find(a => a.value === value);
        action?.onClick();
        sheet.remove();
    }
    
    function handleClose() {
        sheet.remove();
    }
    
    document.body.appendChild(sheet);
}