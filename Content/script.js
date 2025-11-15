// 主页面交互逻辑
document.addEventListener('DOMContentLoaded', function() {
    // 将标题文字分离成单个字母以实现悬停效果
    const welcomeTitle = document.querySelector('.welcome-title');
    if (welcomeTitle) {
        const text = welcomeTitle.textContent;
        welcomeTitle.textContent = '';
        
        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.animationDelay = `${index * 0.05}s`;
            span.style.display = 'inline-block';
            
            // 添加初始淡入动画
            span.style.opacity = '0';
            span.style.transform = 'translateY(20px)';
            span.style.animation = 'letterFadeIn 0.6s ease forwards';
            span.style.animationDelay = `${index * 0.05}s`;
            
            welcomeTitle.appendChild(span);
        });
        
        // 添加淡入动画的 CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes letterFadeIn {
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
        
        // 添加整体脉动动画
        setTimeout(() => {
            welcomeTitle.classList.add('animate');
        }, text.length * 50 + 500);
    }
    
    // 打字机效果
    const typingText = document.getElementById('typingText');
    const quotes = [
        "Building intelligence, one algorithm at a time.",
        "Where code meets consciousness.",
        "Teaching machines to think, humans to dream.",
        "AI is not magic, it's mathematics with purpose.",
        "The future is not predicted, it's programmed."
    ];
    
    let currentQuoteIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;
    
    function typeWriter() {
        const currentQuote = quotes[currentQuoteIndex];
        
        if (!isDeleting && currentCharIndex <= currentQuote.length) {
            // 正在输入
            typingText.textContent = currentQuote.substring(0, currentCharIndex);
            currentCharIndex++;
            
            if (currentCharIndex > currentQuote.length) {
                // 输入完成，等待2秒后开始删除
                setTimeout(() => {
                    isDeleting = true;
                    typeWriter();
                }, 2000);
                return;
            }
        } else if (isDeleting && currentCharIndex >= 0) {
            // 正在删除
            typingText.textContent = currentQuote.substring(0, currentCharIndex);
            currentCharIndex--;
            
            if (currentCharIndex < 0) {
                // 删除完成，切换到下一句
                isDeleting = false;
                currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
                currentCharIndex = 0;
                setTimeout(typeWriter, 300);
                return;
            }
        }
        
        setTimeout(typeWriter, isDeleting ? 40 : typingSpeed);
    }
    
    // 启动打字机效果
    setTimeout(typeWriter, 500);
    
    // 波浪动画
    const waveCanvas = document.getElementById('waveCanvas');
    if (waveCanvas) {
        const ctx = waveCanvas.getContext('2d');
        let waveOffsets = [];
        
        function resizeWaveCanvas() {
            waveCanvas.width = window.innerWidth;
            waveCanvas.height = 150;
        }
        
        resizeWaveCanvas();
        window.addEventListener('resize', resizeWaveCanvas);
        
        // 初始化波浪参数
        for (let i = 0; i < 4; i++) {
            waveOffsets.push({
                speed: 25 + Math.random() * 30,
                length: 180 + Math.random() * 120,
                height: 0.2 + Math.random() * 0.25,
                phase: Math.random() * Math.PI * 2
            });
        }
        
        function drawWave() {
            const time = Date.now() * 0.001;
            const baseY = 50;
            
            ctx.clearRect(0, 0, waveCanvas.width, waveCanvas.height);
            
            // 绘制波浪
            ctx.beginPath();
            ctx.moveTo(0, baseY);
            
            for (let x = 0; x <= waveCanvas.width; x += 3) {
                let y = baseY;
                waveOffsets.forEach(wave => {
                    y += Math.sin((x + time * wave.speed + wave.phase) / wave.length * Math.PI * 2) * 15 * wave.height;
                });
                ctx.lineTo(x, y);
            }
            
            ctx.lineTo(waveCanvas.width, waveCanvas.height);
            ctx.lineTo(0, waveCanvas.height);
            ctx.closePath();
            
            // 渐变填充 - 浅蓝灰色
            const gradient = ctx.createLinearGradient(0, 0, 0, waveCanvas.height);
            gradient.addColorStop(0, 'rgba(140, 170, 190, 0.3)');
            gradient.addColorStop(0.5, 'rgba(120, 150, 170, 0.4)');
            gradient.addColorStop(1, 'rgba(100, 130, 150, 0.5)');
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // 波浪边缘
            ctx.strokeStyle = 'rgba(150, 180, 200, 0.5)';
            ctx.lineWidth = 1.5;
            ctx.stroke();
            
            requestAnimationFrame(drawWave);
        }
        
        drawWave();
    }
    
    // 缠绕玻璃的静态优美线条
    const linesCanvas = document.getElementById('linesCanvas');
    const glassCard = document.querySelector('.glass-card');
    
    if (linesCanvas && glassCard) {
        const ctx = linesCanvas.getContext('2d');
        let glassRect = null;
        
        function resizeLinesCanvas() {
            linesCanvas.width = window.innerWidth;
            linesCanvas.height = linesCanvas.parentElement.offsetHeight;
            updateGlassRect();
            drawStaticLines();
        }
        
        function updateGlassRect() {
            glassRect = glassCard.getBoundingClientRect();
            const sectionRect = linesCanvas.parentElement.getBoundingClientRect();
            glassRect = {
                centerX: glassRect.left - sectionRect.left + glassRect.width / 2,
                centerY: glassRect.top - sectionRect.top + glassRect.height / 2,
                width: glassRect.width,
                height: glassRect.height
            };
        }
        
        function drawStaticLines() {
            if (!glassRect) return;
            
            ctx.clearRect(0, 0, linesCanvas.width, linesCanvas.height);
            
            // 三条线的配置：红粉、蓝绿、黄粉
            const strokes = [
                {
                    colors: [
                        { r: 255, g: 120, b: 150 }, // 红
                        { r: 255, g: 160, b: 180 }, // 粉
                        { r: 255, g: 200, b: 210 }  // 浅粉
                    ],
                    startAngle: -0.3,
                    loops: 2.2
                },
                {
                    colors: [
                        { r: 100, g: 180, b: 200 }, // 蓝
                        { r: 120, g: 200, b: 180 }, // 蓝绿
                        { r: 150, g: 220, b: 200 }  // 浅绿
                    ],
                    startAngle: 0.8,
                    loops: 2.5
                },
                {
                    colors: [
                        { r: 255, g: 200, b: 120 }, // 黄
                        { r: 255, g: 180, b: 160 }, // 黄粉
                        { r: 255, g: 200, b: 190 }  // 浅粉
                    ],
                    startAngle: 2.0,
                    loops: 2.3
                }
            ];
            
            strokes.forEach(stroke => {
                drawBeautifulStroke(stroke);
            });
        }
        
        function drawBeautifulStroke(config) {
            const segments = 150;
            const points = [];
            const radius = glassRect.width * 0.5;
            const heightFactor = glassRect.height / glassRect.width;
            
            // 计算优美的缠绕路径，根据玻璃高度调整
            for (let i = 0; i <= segments; i++) {
                const t = i / segments;
                
                // 使用参数方程创建优美的螺旋
                const angle = config.startAngle + t * Math.PI * config.loops;
                const r = radius * (0.85 + Math.sin(t * Math.PI * 2) * 0.15);
                
                const x = glassRect.centerX + Math.cos(angle) * r;
                const y = glassRect.centerY + Math.sin(angle) * r * 0.75 * heightFactor + 
                          Math.sin(t * Math.PI * 3) * 45 * heightFactor;
                
                points.push({ x, y, t });
            }
            
            // 绘制三层渐变
            const layers = [
                { widthMult: 2.2, alpha: 0.12, blur: 12 },
                { widthMult: 1.4, alpha: 0.28, blur: 6 },
                { widthMult: 1.0, alpha: 0.45, blur: 0 }
            ];
            
            layers.forEach((layer, layerIdx) => {
                // 创建渐变
                const gradient = ctx.createLinearGradient(
                    points[0].x, points[0].y,
                    points[points.length - 1].x, points[points.length - 1].y
                );
                
                const c1 = config.colors[0];
                const c2 = config.colors[1];
                const c3 = config.colors[2];
                
                gradient.addColorStop(0, `rgba(${c1.r}, ${c1.g}, ${c1.b}, 0)`);
                gradient.addColorStop(0.15, `rgba(${c1.r}, ${c1.g}, ${c1.b}, ${layer.alpha})`);
                gradient.addColorStop(0.5, `rgba(${c2.r}, ${c2.g}, ${c2.b}, ${layer.alpha})`);
                gradient.addColorStop(0.85, `rgba(${c3.r}, ${c3.g}, ${c3.b}, ${layer.alpha})`);
                gradient.addColorStop(1, `rgba(${c3.r}, ${c3.g}, ${c3.b}, 0)`);
                
                ctx.beginPath();
                points.forEach((point, i) => {
                    if (i === 0) {
                        ctx.moveTo(point.x, point.y);
                    } else {
                        ctx.lineTo(point.x, point.y);
                    }
                });
                
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 35 * layer.widthMult;
                ctx.lineCap = 'butt'; // 断裂感
                ctx.lineJoin = 'round';
                
                if (layer.blur > 0) {
                    ctx.shadowColor = `rgba(${c2.r}, ${c2.g}, ${c2.b}, 0.3)`;
                    ctx.shadowBlur = layer.blur;
                }
                
                ctx.stroke();
                ctx.shadowBlur = 0;
            });
        }
        
        resizeLinesCanvas();
        window.addEventListener('resize', resizeLinesCanvas);
    }
    
    // 像素点流动图形 - 横向滚动（优化版）
    const pixelEarthCanvas = document.getElementById('pixelEarthCanvas');
    if (pixelEarthCanvas) {
        const ctx = pixelEarthCanvas.getContext('2d');
        let flowDots = [];
        let textDots = [];
        let borderDots = [];
        let scrollOffset = 0;
        const mapWidth = 2500;
        
        function resizePixelCanvas() {
            pixelEarthCanvas.width = window.innerWidth;
            pixelEarthCanvas.height = 450;
            initDots();
        }
        
        function initDots() {
            flowDots = [];
            textDots = [];
            borderDots = [];
            
            const spacing = 10; // 平衡性能和视觉效果
            const cols = Math.floor(mapWidth / spacing);
            const rows = Math.floor(pixelEarthCanvas.height / spacing);
            
            // 创建流动的背景点
            for (let row = 2; row < rows - 2; row++) { // 避免边界溢出
                for (let col = 0; col < cols; col++) {
                    const normalizedX = col / cols;
                    const normalizedY = row / rows;
                    
                    // 保持原有的波浪计算
                    const wave1 = Math.sin(normalizedX * Math.PI * 4 + normalizedY * 3) * 0.5 + 0.5;
                    const wave2 = Math.sin(normalizedX * Math.PI * 6 - normalizedY * 2) * 0.5 + 0.5;
                    const combined = (wave1 + wave2) / 2;
                    
                    if (combined > 0.35 && combined < 0.75 && Math.random() > 0.68) {
                        const gray = 90 + Math.random() * 20;
                        flowDots.push({
                            baseX: col * spacing,
                            y: row * spacing,
                            size: 2 + Math.random() * 0.5,
                            gray: gray,
                            alpha: 0.25 + Math.random() * 0.15
                        });
                    }
                }
            }
            
            // 创建边界像素点
            const borderSpacing = 12;
            for (let x = 0; x < pixelEarthCanvas.width; x += borderSpacing) {
                borderDots.push({
                    x: x,
                    y: 8,
                    size: 2,
                    gray: 70,
                    alpha: 0.4
                });
                borderDots.push({
                    x: x,
                    y: pixelEarthCanvas.height - 8,
                    size: 2,
                    gray: 70,
                    alpha: 0.4
                });
            }
            
            createTextDots();
        }
        
        function createTextDots() {
            const text = 'Aionium - AI Engineer';
            const centerX = pixelEarthCanvas.width / 2;
            const centerY = pixelEarthCanvas.height / 2;
            
            const tempCanvas = document.createElement('canvas');
            const tempCtx = tempCanvas.getContext('2d');
            tempCtx.font = '600 55px "Segoe UI", Arial, sans-serif';
            const textWidth = tempCtx.measureText(text).width;
            
            tempCanvas.width = textWidth + 40;
            tempCanvas.height = 90;
            tempCtx.font = '600 55px "Segoe UI", Arial, sans-serif';
            tempCtx.fillStyle = 'white';
            tempCtx.textAlign = 'center';
            tempCtx.fillText(text, tempCanvas.width / 2, 65);
            
            const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
            const spacing = 3.5; // 优化采样密度
            
            for (let y = 0; y < tempCanvas.height; y += spacing) {
                for (let x = 0; x < tempCanvas.width; x += spacing) {
                    const index = (Math.floor(y) * tempCanvas.width + Math.floor(x)) * 4;
                    const alpha = imageData.data[index + 3];
                    
                    if (alpha > 120) {
                        const finalY = centerY - 45 + y;
                        // 确保文字点在边界内
                        if (finalY > 15 && finalY < pixelEarthCanvas.height - 15) {
                            textDots.push({
                                x: centerX - tempCanvas.width / 2 + x,
                                y: finalY,
                                size: 2.5,
                                gray: 35,
                                alpha: 0.85
                            });
                        }
                    }
                }
            }
        }
        
        function drawPixelEarth() {
            ctx.clearRect(0, 0, pixelEarthCanvas.width, pixelEarthCanvas.height);
            
            scrollOffset += 0.8;
            if (scrollOffset > mapWidth) {
                scrollOffset = 0;
            }
            
            // 绘制背景点（保持原有的颜色变化）
            flowDots.forEach(dot => {
                let x = dot.baseX - scrollOffset;
                
                while (x < -10) {
                    x += mapWidth;
                }
                
                if (x < pixelEarthCanvas.width + 10) {
                    ctx.fillStyle = `rgba(${dot.gray}, ${dot.gray}, ${dot.gray}, ${dot.alpha})`;
                    ctx.beginPath();
                    ctx.arc(x, dot.y, dot.size, 0, Math.PI * 2);
                    ctx.fill();
                }
            });
            
            // 绘制边界点
            ctx.fillStyle = 'rgba(70, 70, 70, 0.4)';
            borderDots.forEach(dot => {
                ctx.beginPath();
                ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
                ctx.fill();
            });
            
            // 绘制文字点
            ctx.fillStyle = 'rgba(35, 35, 35, 0.85)';
            textDots.forEach(dot => {
                ctx.beginPath();
                ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
                ctx.fill();
            });
            
            requestAnimationFrame(drawPixelEarth);
        }
        
        resizePixelCanvas();
        window.addEventListener('resize', resizePixelCanvas);
        drawPixelEarth();
    }
    
    // 滚动动画和内容显示
    const mainContent = document.getElementById('mainContent');
    const welcomeSection = document.getElementById('welcomeSection');
    const contentSection = document.getElementById('contentSection');
    
    // 首次加载时显示内容区域（多重保险）
    if (contentSection && mainContent) {
        // 立即检查一次
        const checkAndShow = () => {
            if (mainContent.style.display !== 'none') {
                contentSection.classList.add('visible');
            }
        };
        
        // 多个时间点检查，确保一定能显示
        setTimeout(checkAndShow, 100);
        setTimeout(checkAndShow, 500);
        setTimeout(checkAndShow, 1000);
        
        // 简单的滚动监听
        mainContent.addEventListener('scroll', function() {
            const scrollTop = mainContent.scrollTop;
            const welcomeHeight = welcomeSection ? welcomeSection.offsetHeight : 0;
            
            // 滚动到内容区域时显示动画
            if (scrollTop > welcomeHeight * 0.3) {
                contentSection.classList.add('visible');
            }
        });
    }
});
