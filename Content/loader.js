class LoaderAnimation {
    constructor() {
        this.canvas = document.getElementById('loaderCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.bubbles = [];
        this.stars = [];
        this.waveOffset = 0;
        this.textOpacity = 0;
        this.subtitleOpacity = 0;
        this.circleRotation = 0;
        this.checkProgress = 0;
        this.phase = 'intro';
        this.quoteOpacity = 0;
        this.letterSpacing = 0;
        this.glowIntensity = 0;
        this.transformProgress = 0;
        this.newTextLetterSpacing = 0;
        
        // 为波浪添加随机偏移
        this.waveOffsets = [];
        for (let i = 0; i < 5; i++) {
            this.waveOffsets.push({
                speed: 30 + Math.random() * 40,
                length: 200 + Math.random() * 150,
                height: 0.15 + Math.random() * 0.2, // 减小波浪高度
                phase: Math.random() * Math.PI * 2
            });
        }
        
        this.quotes = [
            "Code is design.",
            "Less is more.",
            "Fix the cause, not the symptom.",
            "Talk is cheap. Show me the code.",
            "Premature optimization is the root of all evil."
        ];
        this.currentQuote = this.quotes[Math.floor(Math.random() * this.quotes.length)];
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.init();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        this.waveY = this.canvas.height * 0.85;
    }
    
    init() {
        // 检查是否已经播放过加载动画
        if (sessionStorage.getItem('loaderShown') === 'true') {
            // 直接跳过加载动画
            this.skipLoader();
            return;
        }
        
        // 标记加载动画已播放
        sessionStorage.setItem('loaderShown', 'true');
        
        this.createStars();
        this.startSequence();
        this.animate();
    }
    
    skipLoader() {
        const loader = document.getElementById('loader');
        const mainContent = document.getElementById('mainContent');
        const contentSection = document.getElementById('contentSection');
        
        loader.style.display = 'none';
        mainContent.style.display = 'block';
        
        // 立即显示内容区域
        if (contentSection) {
            setTimeout(() => {
                contentSection.classList.add('visible');
            }, 100);
        }
    }
    
    createStars() {
        for (let i = 0; i < 80; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height * 0.7,
                size: Math.random() * 2,
                opacity: Math.random() * 0.5 + 0.3,
                twinkleSpeed: Math.random() * 0.02 + 0.01
            });
        }
    }
    
    createBubble() {
        const x = Math.random() * this.canvas.width;
        // 计算该位置的波浪高度
        const time = Date.now() * 0.001;
        let waveHeight = 0;
        this.waveOffsets.forEach(wave => {
            waveHeight += Math.sin((x + time * wave.speed + wave.phase) / wave.length * Math.PI * 2) * 20 * wave.height;
        });
        
        this.bubbles.push({
            x: x,
            y: this.waveY + waveHeight, // 从实际波浪位置开始
            radius: Math.random() * 8 + 4, // 增大气泡尺寸
            speed: Math.random() * 0.8 + 0.4,
            wobble: Math.random() * Math.PI * 2,
            wobbleSpeed: Math.random() * 0.02 + 0.01,
            opacity: Math.random() * 0.35 + 0.2,
            birthY: this.waveY + waveHeight // 记录出生位置
        });
    }
    
    startSequence() {
        setTimeout(() => {
            this.phase = 'showing';
            setTimeout(() => {
                this.phase = 'transforming';
                this.transformProgress = 0;
                setTimeout(() => {
                    this.phase = 'complete';
                    setTimeout(() => {
                        this.phase = 'fadeout';
                        this.fadeOut();
                    }, 400);
                }, 800);
            }, 1200);
        }, 400);
    }
    
    fadeOut() {
        const loader = document.getElementById('loader');
        const mainContent = document.getElementById('mainContent');
        const contentSection = document.getElementById('contentSection');
        
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
            mainContent.style.display = 'block';
            
            // 强制重新初始化所有画布
            setTimeout(() => {
                // 触发窗口resize事件，让所有画布重新计算尺寸
                window.dispatchEvent(new Event('resize'));
                
                // 显示内容区域
                if (contentSection) {
                    contentSection.classList.add('visible');
                }
            }, 100);
        }, 800);
    }
    
    animate() {
        const time = Date.now() * 0.001;
        
        // 渐变背景
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, 'rgb(20, 19, 20)');
        gradient.addColorStop(0.7, 'rgb(22, 21, 23)');
        gradient.addColorStop(1, 'rgb(25, 24, 26)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制星星
        this.stars.forEach(star => {
            star.opacity = 0.2 + Math.sin(time * star.twinkleSpeed * 10) * 0.2;
            this.ctx.fillStyle = `rgba(200, 200, 210, ${star.opacity})`;
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        // 绘制引用文字
        this.drawQuote();
        
        // 绘制波浪
        this.drawWave(time);
        
        // 更新和绘制气泡 - 减少生成频率
        if (Math.random() < 0.015) {
            this.createBubble();
        }
        
        this.bubbles = this.bubbles.filter(bubble => {
            bubble.y -= bubble.speed;
            bubble.wobble += bubble.wobbleSpeed;
            bubble.x += Math.sin(bubble.wobble) * 0.5;
            
            if (bubble.y < -50) return false;
            
            // 计算当前位置的波浪高度
            let currentWaveY = this.waveY;
            this.waveOffsets.forEach(wave => {
                currentWaveY += Math.sin((bubble.x + time * wave.speed + wave.phase) / wave.length * Math.PI * 2) * 20 * wave.height;
            });
            
            // 气泡在波浪上方时才显示，并且有渐显效果
            const distanceFromWave = currentWaveY - bubble.y;
            let bubbleOpacity = 0;
            
            if (distanceFromWave > 10) {
                // 离开波浪10px后开始显示
                bubbleOpacity = Math.min(bubble.opacity, (distanceFromWave - 10) / 30);
            }
            
            if (bubbleOpacity > 0) {
                // 绘制气泡主体 - 浅蓝灰色调
                this.ctx.fillStyle = `rgba(140, 180, 200, ${bubbleOpacity})`;
                this.ctx.beginPath();
                this.ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
                this.ctx.fill();
                
                // 绘制气泡边缘高光
                this.ctx.strokeStyle = `rgba(180, 210, 230, ${bubbleOpacity * 0.7})`;
                this.ctx.lineWidth = 1.5;
                this.ctx.stroke();
                
                // 添加气泡内部高光点
                const highlightGradient = this.ctx.createRadialGradient(
                    bubble.x - bubble.radius * 0.3, 
                    bubble.y - bubble.radius * 0.3, 
                    0,
                    bubble.x - bubble.radius * 0.3, 
                    bubble.y - bubble.radius * 0.3, 
                    bubble.radius * 0.6
                );
                highlightGradient.addColorStop(0, `rgba(255, 255, 255, ${bubbleOpacity * 0.4})`);
                highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
                this.ctx.fillStyle = highlightGradient;
                this.ctx.beginPath();
                this.ctx.arc(bubble.x - bubble.radius * 0.3, bubble.y - bubble.radius * 0.3, bubble.radius * 0.6, 0, Math.PI * 2);
                this.ctx.fill();
            }
            
            return true;
        });
        
        // 文字动画
        if (this.phase === 'intro' || this.phase === 'showing') {
            this.textOpacity = Math.min(1, this.textOpacity + 0.04);
            this.subtitleOpacity = Math.min(0.7, this.subtitleOpacity + 0.03);
            this.letterSpacing = Math.min(8, this.letterSpacing + 0.5);
            this.glowIntensity = Math.min(1, this.glowIntensity + 0.04);
        } else if (this.phase === 'transforming') {
            // 在变换阶段逐渐增加新文字的字母间距
            this.newTextLetterSpacing = Math.min(8, this.newTextLetterSpacing + 0.6);
        } else if (this.phase === 'fadeout') {
            this.textOpacity = Math.max(0, this.textOpacity - 0.05);
            this.subtitleOpacity = Math.max(0, this.subtitleOpacity - 0.05);
        }
        
        const titleY = this.centerY - 100;
        
        // 主标题 - 带动画效果
        this.ctx.save();
        
        if (this.phase === 'transforming') {
            this.transformProgress = Math.min(1, this.transformProgress + 0.02);
            this.drawTransformingText(titleY, this.transformProgress);
        } else if (this.phase === 'complete' || this.phase === 'fadeout') {
            // 保持显示 AI Engineer
            this.drawAnimatedText('AI Engineer', this.centerX, titleY, this.textOpacity, 80, true);
        } else {
            this.drawAnimatedText('Aionium', this.centerX, titleY, this.textOpacity, 80, false);
        }
        
        this.ctx.restore();
        
        // 副标题 - 更远的距离
        this.ctx.font = '300 32px "Segoe UI", Arial, sans-serif';
        this.ctx.fillStyle = `rgba(160, 160, 180, ${this.subtitleOpacity})`;
        this.ctx.textAlign = 'center';
        this.ctx.letterSpacing = '4px';
        this.ctx.fillText('Blog', this.centerX, titleY + 90);
        
        // 加载圆圈或对勾
        const spinnerY = this.centerY + 80;
        
        if (this.phase === 'complete' || this.phase === 'fadeout') {
            this.checkProgress = Math.min(1, this.checkProgress + 0.06);
            this.drawCheckmark(this.centerX, spinnerY, this.checkProgress);
        } else {
            this.circleRotation += 0.1;
            this.drawSpinner(this.centerX, spinnerY, this.circleRotation);
        }
        
        requestAnimationFrame(() => this.animate());
    }
    
    drawWave(time) {
        this.ctx.save();
        this.ctx.beginPath();
        
        const baseWaveHeight = 20;
        
        this.ctx.moveTo(0, this.waveY);
        
        // 使用多个随机波浪叠加，创造不规则效果
        for (let x = 0; x <= this.canvas.width; x += 3) {
            let y = this.waveY;
            
            this.waveOffsets.forEach(wave => {
                y += Math.sin((x + time * wave.speed + wave.phase) / wave.length * Math.PI * 2) * baseWaveHeight * wave.height;
            });
            
            this.ctx.lineTo(x, y);
        }
        
        this.ctx.lineTo(this.canvas.width, this.canvas.height);
        this.ctx.lineTo(0, this.canvas.height);
        this.ctx.closePath();
        
        // 浅蓝+灰色渐变
        const waveGradient = this.ctx.createLinearGradient(0, this.waveY - 50, 0, this.canvas.height);
        waveGradient.addColorStop(0, 'rgba(140, 170, 190, 0.25)');
        waveGradient.addColorStop(0.5, 'rgba(120, 150, 170, 0.3)');
        waveGradient.addColorStop(1, 'rgba(100, 130, 150, 0.35)');
        this.ctx.fillStyle = waveGradient;
        this.ctx.fill();
        
        this.ctx.strokeStyle = 'rgba(150, 180, 200, 0.4)';
        this.ctx.lineWidth = 1.2;
        this.ctx.stroke();
        
        this.ctx.restore();
    }
    
    drawQuote() {
        if (this.phase === 'intro' || this.phase === 'showing') {
            this.quoteOpacity = Math.min(0.6, this.quoteOpacity + 0.01);
        } else if (this.phase === 'fadeout') {
            this.quoteOpacity = Math.max(0, this.quoteOpacity - 0.03);
        }
        
        this.ctx.save();
        this.ctx.font = '300 16px "Segoe UI", Arial, sans-serif';
        this.ctx.fillStyle = `rgba(140, 140, 150, ${this.quoteOpacity})`;
        this.ctx.textAlign = 'left';
        this.ctx.fillText(this.currentQuote, 40, 40);
        this.ctx.restore();
    }
    
    drawAnimatedText(text, x, y, opacity, size, isTransform) {
        this.ctx.font = `300 ${size}px "Segoe UI", Arial, sans-serif`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        const letters = text.split('');
        const spacing = isTransform ? this.newTextLetterSpacing : this.letterSpacing;
        const totalWidth = this.ctx.measureText(text).width + spacing * (letters.length - 1);
        let currentX = x - totalWidth / 2;
        
        letters.forEach((letter, index) => {
            if (letter === ' ') {
                currentX += this.ctx.measureText(letter).width + spacing;
                return;
            }
            
            const letterWidth = this.ctx.measureText(letter).width;
            const time = Date.now() * 0.001;
            // 增加浮动幅度
            const wave = Math.sin(time * 1.8 + index * 0.4) * 5;
            
            this.ctx.save();
            
            if (!isTransform) {
                this.ctx.shadowColor = `rgba(100, 150, 200, ${this.glowIntensity * 0.6})`;
                this.ctx.shadowBlur = 15 + Math.sin(time * 3 + index) * 5;
            }
            
            this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            this.ctx.fillText(letter, currentX + letterWidth / 2, y + wave);
            
            this.ctx.restore();
            
            currentX += letterWidth + spacing;
        });
    }
    
    drawTransformingText(y, progress) {
        const oldText = 'Aionium';
        const newText = 'AI Engineer';
        
        // 更流畅的缓动函数 (easeInOutCubic)
        const easeProgress = progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        
        this.ctx.font = '300 80px "Segoe UI", Arial, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        // 旧文字淡出并向上飞散，带模糊效果
        const oldOpacity = Math.max(0, 1 - progress * 1.8);
        const oldY = y - easeProgress * 60;
        const oldScale = 1 - easeProgress * 0.2;
        const oldBlur = easeProgress * 8;
        
        this.ctx.save();
        this.ctx.globalAlpha = oldOpacity;
        this.ctx.filter = `blur(${oldBlur}px)`;
        this.ctx.translate(this.centerX, oldY);
        this.ctx.scale(oldScale, oldScale);
        this.ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        this.ctx.fillText(oldText, 0, 0);
        this.ctx.restore();
        
        // 新文字从下方淡入，带模糊到清晰的效果，使用逐字母动画
        const newOpacity = Math.max(0, Math.min(1, (progress - 0.15) * 2));
        const newY = y + (1 - easeProgress) * 60;
        const newScale = 0.8 + easeProgress * 0.2;
        const newBlur = (1 - easeProgress) * 8;
        
        this.ctx.save();
        this.ctx.globalAlpha = newOpacity;
        this.ctx.filter = `blur(${newBlur}px)`;
        this.ctx.translate(this.centerX, newY);
        this.ctx.scale(newScale, newScale);
        
        // 使用字母间距绘制
        const letters = newText.split('');
        const spacing = this.newTextLetterSpacing;
        const totalWidth = this.ctx.measureText(newText).width + spacing * (letters.length - 1);
        let currentX = -totalWidth / 2;
        
        letters.forEach((letter, index) => {
            if (letter === ' ') {
                currentX += this.ctx.measureText(letter).width + spacing;
                return;
            }
            
            const letterWidth = this.ctx.measureText(letter).width;
            const time = Date.now() * 0.001;
            const wave = Math.sin(time * 1.8 + index * 0.4) * 3;
            
            this.ctx.fillStyle = 'rgba(255, 255, 255, 1)';
            this.ctx.fillText(letter, currentX + letterWidth / 2, wave);
            
            currentX += letterWidth + spacing;
        });
        
        this.ctx.restore();
    }
    
    drawSpinner(x, y, rotation) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(rotation);
        
        this.ctx.strokeStyle = 'rgba(200, 200, 210, 0.15)';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 20, 0, Math.PI * 2);
        this.ctx.stroke();
        
        this.ctx.strokeStyle = 'rgba(120, 160, 180, 1)';
        this.ctx.lineWidth = 3;
        this.ctx.lineCap = 'round';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 20, 0, Math.PI * 1.5);
        this.ctx.stroke();
        
        this.ctx.restore();
    }
    
    drawCheckmark(x, y, progress) {
        this.ctx.save();
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
        this.ctx.lineWidth = 4;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        
        this.ctx.beginPath();
        
        if (progress < 0.5) {
            const p = progress * 2;
            this.ctx.moveTo(x - 15, y);
            this.ctx.lineTo(x - 15 + 10 * p, y + 10 * p);
        } else {
            const p = (progress - 0.5) * 2;
            this.ctx.moveTo(x - 15, y);
            this.ctx.lineTo(x - 5, y + 10);
            this.ctx.lineTo(x - 5 + 20 * p, y + 10 - 25 * p);
        }
        
        this.ctx.stroke();
        this.ctx.restore();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new LoaderAnimation();
});
