// 格式化金额
export function formatAmount(amount, currency = 'USDT', showSymbol = true) {
    const formatted = new Intl.NumberFormat('zh-CN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
    
    return showSymbol ? `${formatted} ${currency}` : formatted;
}

// 格式化时间
export function formatDate(date, format = 'relative') {
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    
    if (format === 'relative') {
        if (diff < 86400000) { // 24小时内
            if (diff < 3600000) { // 1小时内
                return `${Math.floor(diff / 60000)}分钟前`;
            }
            return `${Math.floor(diff / 3600000)}小时前`;
        }
        
        if (d.getFullYear() === now.getFullYear()) {
            return `${d.getMonth() + 1}月${d.getDate()}日`;
        }
        
        return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
    }
    
    return d.toLocaleString('zh-CN');
}

// 虚拟列表实现
export class VirtualScroller {
    constructor(container, items, rowHeight, renderItem) {
        this.container = container;
        this.items = items;
        this.rowHeight = rowHeight;
        this.renderItem = renderItem;
        
        this.visibleItems = Math.ceil(container.clientHeight / rowHeight);
        this.totalHeight = items.length * rowHeight;
        this.scrollTop = 0;
        
        this.init();
    }
    
    init() {
        this.container.style.position = 'relative';
        this.container.style.overflow = 'auto';
        
        const content = document.createElement('div');
        content.style.height = `${this.totalHeight}px`;
        this.container.appendChild(content);
        
        this.container.addEventListener('scroll', this.onScroll.bind(this));
        this.render();
    }
    
    onScroll() {
        this.scrollTop = this.container.scrollTop;
        this.render();
    }
    
    render() {
        const start = Math.floor(this.scrollTop / this.rowHeight);
        const end = Math.min(start + this.visibleItems + 1, this.items.length);
        
        const fragment = document.createDocumentFragment();
        
        for (let i = start; i < end; i++) {
            const item = this.items[i];
            const element = this.renderItem(item);
            element.style.position = 'absolute';
            element.style.top = `${i * this.rowHeight}px`;
            fragment.appendChild(element);
        }
        
        this.container.innerHTML = '';
        this.container.appendChild(fragment);
    }
}

// 下拉刷新实现
export class PullToRefresh {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            threshold: 60,
            onRefresh: async () => {},
            ...options
        };
        
        this.init();
    }
    
    init() {
        this.indicator = document.createElement('div');
        this.indicator.className = 'pull-refresh-indicator';
        this.container.prepend(this.indicator);
        
        this.bindEvents();
    }
    
    bindEvents() {
        let startY = 0;
        let pulling = false;
        
        this.container.addEventListener('touchstart', (e) => {
            if (this.container.scrollTop === 0) {
                startY = e.touches[0].clientY;
                pulling = true;
            }
        });
        
        this.container.addEventListener('touchmove', (e) => {
            if (!pulling) return;
            
            const deltaY = e.touches[0].clientY - startY;
            if (deltaY > 0) {
                e.preventDefault();
                this.indicator.style.transform = `scaleY(${Math.min(deltaY / this.options.threshold, 1)})`;
            }
        });
        
        this.container.addEventListener('touchend', async () => {
            if (!pulling) return;
            
            pulling = false;
            if (this.indicator.style.transform.includes('scaleY(1)')) {
                await this.options.onRefresh();
            }
            
            this.indicator.style.transform = 'scaleY(0)';
        });
    }
}

// 状态管理
export class Store {
    constructor(initialState = {}) {
        this.state = initialState;
        this.listeners = new Set();
    }
    
    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }
    
    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.listeners.forEach(listener => listener(this.state));
    }
    
    getState() {
        return this.state;
    }
}
