// Support页面的交互逻辑
document.addEventListener('DOMContentLoaded', function() {
    // 打字机效果
    const quotes = [
        "Innovation is not about saying yes to everything. It's about saying no to all but the most crucial features.",
        "The best way to predict the future is to invent it.",
        "Code is like humor. When you have to explain it, it's bad.",
        "First, solve the problem. Then, write the code.",
        "Any fool can write code that a computer can understand. Good programmers write code that humans can understand."
    ];
    
    const quoteElement = document.getElementById('paymentQuote');
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    
    let charIndex = 0;
    
    function typeWriter() {
        if (charIndex < randomQuote.length) {
            quoteElement.textContent += randomQuote.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, 50);
        }
    }
    
    setTimeout(typeWriter, 500);
    
    // 进度时间线交互
    const timelineDots = document.querySelectorAll('.timeline-dot');
    const sections = document.querySelectorAll('.content-section, .payment-section');
    
    // 点击时间线点跳转到对应区域
    timelineDots.forEach(dot => {
        dot.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            const targetSection = document.getElementById(sectionId);
            
            if (targetSection) {
                const headerHeight = 80;
                const targetPosition = targetSection.offsetTop - headerHeight - 50;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 滚动时更新时间线状态
    function updateTimeline() {
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        
        let activeIndex = 0;
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                activeIndex = index;
            }
        });
        
        timelineDots.forEach((dot, index) => {
            if (index === activeIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // 监听滚动事件
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateTimeline, 50);
    });
    
    // 初始化时间线状态
    updateTimeline();
});
