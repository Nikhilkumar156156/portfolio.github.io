/* ==========================================================================
   Project Demos Logic (demos.js)
   Manages interactive simulations for script/utility projects in the browser
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Modal Elements & State Management ---
    const overlay = document.getElementById('demo-modal-overlay');
    const container = overlay ? overlay.querySelector('.demo-modal-container') : null;
    const modalTitle = document.getElementById('demo-modal-title');
    const modalBadge = document.getElementById('demo-modal-badge');
    const modalBody = document.getElementById('demo-modal-body');
    const closeBtn = document.getElementById('demo-modal-close');

    let currentDemo = null;
    let cancelDemoAnimation = false;
    let ttsUtterance = null;

    // --- Helper: Sleep ---
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // --- Helper: Lucide Refresh ---
    const refreshIcons = () => {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    };

    // --- Bind Trigger Buttons ---
    const bindTriggers = () => {
        document.querySelectorAll('.run-demo-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const projectId = btn.getAttribute('data-project');
                openDemo(projectId);
            });
        });
    };

    // --- Open Modal ---
    const openDemo = (id) => {
        if (!overlay || !modalBody) return;
        currentDemo = id;
        cancelDemoAnimation = false;
        
        // Stop any active SpeechSynthesis
        stopSpeech();

        // Setup titles/badges & HTML templates
        let titleText = '';
        let badgeText = '';
        let contentHtml = '';

        switch (id) {
            case 'voice-news':
                titleText = 'Voice News Reader';
                badgeText = 'Web Speech & APIs';
                contentHtml = getVoiceNewsTemplate();
                break;
            case 'media-extract':
                titleText = 'Media Extraction & GIF Suite';
                badgeText = 'OpenCV & Canvas';
                contentHtml = getMediaExtractTemplate();
                break;
            case 'rename-it':
                titleText = 'RenameIt File Automator';
                badgeText = 'System Utility';
                contentHtml = getRenameItTemplate();
                break;
            case 'rock-paper-scissors':
                titleText = 'Rock Paper Scissors Game';
                badgeText = 'Python Logic & Game';
                contentHtml = getRockPaperScissorsTemplate();
                break;
            case 'video-caption':
                titleText = 'Video Caption Merger';
                badgeText = 'OpenCV & Subtitles';
                contentHtml = getVideoCaptionTemplate();
                break;
            case 'password-suite':
                titleText = 'Secure Password Generator';
                badgeText = 'Crypto & Security';
                contentHtml = getPasswordSuiteTemplate();
                break;
            default:
                return;
        }

        modalTitle.textContent = titleText;
        modalBadge.textContent = badgeText;
        modalBody.innerHTML = contentHtml;
        
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock background scrolling
        refreshIcons();

        // Initialize specific logic
        initializeDemoLogic(id);
    };

    // --- Close Modal ---
    const closeDemo = () => {
        if (!overlay) return;
        cancelDemoAnimation = true;
        stopSpeech();
        overlay.classList.remove('active');
        document.body.style.overflow = ''; // Unlock scroll
        if (modalBody) modalBody.innerHTML = '';
        currentDemo = null;
    };

    // --- Speech Synthesis Control ---
    const stopSpeech = () => {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        document.querySelectorAll('.news-card').forEach(card => {
            card.classList.remove('speaking');
        });
    };

    // Bind Close Events
    if (closeBtn) closeBtn.addEventListener('click', closeDemo);
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeDemo();
        });
    }
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay && overlay.classList.contains('active')) {
            closeDemo();
        }
    });

    // ==========================================================================
    // INITIALIZE SPECIFIC DEMO LOGIC
    // ==========================================================================
    const initializeDemoLogic = (id) => {
        switch (id) {
            case 'voice-news':
                initVoiceNews();
                break;
            case 'media-extract':
                initMediaExtract();
                break;
            case 'rename-it':
                initRenameIt();
                break;
            case 'rock-paper-scissors':
                initRockPaperScissors();
                break;
            case 'video-caption':
                initVideoCaption();
                break;
            case 'password-suite':
                initPasswordSuite();
                break;
        }
    };

    // ==========================================================================
    // 1. VOICE NEWS READER DEMO
    // ==========================================================================
    const mockNewsData = {
        general: [
            { title: "Nikhil Kumar Launches Premium Developer Portfolio v2.0", desc: "Computer Science student Nikhil Kumar unveils a fully responsive developer site integrating interactive project workspaces and fluid CSS layout designs.", time: "1 hour ago", source: "Nik Tech Blog" },
            { title: "Global Technology Index Hits Historic High Amid Artificial Intelligence Rally", desc: "Venture capitals and public markets surge as AI automation models begin deployment across major enterprise infrastructure.", time: "3 hours ago", source: "Tech Financials" },
            { title: "Renewable Energy Capacity Surpasses Forecasts in 2026 Grid Update", desc: "Solar arrays and offshore wind systems combined to supply more than forty percent of electrical grid peaks last month.", time: "12 hours ago", source: "Green Tech Journal" }
        ],
        tech: [
            { title: "OpenCV Releases Version 5.2 with Accelerated Hardware Neural Nets", desc: "The open source computer vision project integrates optimized execution pathways for edge computing devices and webassembly runtimes.", time: "2 hours ago", source: "Computer Vision News" },
            { title: "Web Cryptography API Becomes Industry Standard for Browser Encryptions", desc: "Security experts endorse window dot crypto utilities to generate highly secure cryptographic salts directly in memory arrays.", time: "4 hours ago", source: "Cyber Security Journal" },
            { title: "Next-Gen Game Engines Pivot to Real-Time Raytracing Node Systems", desc: "Developers demonstrate seamless shader compilation processes that optimize physics simulations on small device formats.", time: "1 day ago", source: "Gamer Dev Weekly" }
        ],
        business: [
            { title: "Artificial Intelligence Startups Secure Record Series A Funding Packages", desc: "Private equity firms invest billions into developer tooling, code synthesis agents, and localized language models.", time: "5 hours ago", source: "Silicon Business" },
            { title: "Freelance Economy Explodes as Collaborative Workspaces Take Root Online", desc: "Statistics show a forty percent increase in remote technical integrations, focusing heavily on custom automation and scripting workflows.", time: "7 hours ago", source: "Global Venture Daily" }
        ],
        sports: [
            { title: "AI-Powered Visual Analytics Reshape Professional Training Routines", desc: "Coaches integrate tracking libraries to log player coordinates and optimize field formations in real-time.", time: "10 hours ago", source: "Sport Science Hub" },
            { title: "Esports Arena Welcomes Record Viewership in Strategy Finals", desc: "Streaming platforms log over ten million concurrent viewers watching the final match of the global strategy league.", time: "1 day ago", source: "Gamer News Network" }
        ],
        science: [
            { title: "Deep Space Telescope Detects Atmospheric Signatures on Earth-Sized Exoplanet", desc: "Spectroscopy arrays confirm the presence of methane and water vapor in the atmosphere of a star system forty light years away.", time: "8 hours ago", source: "Cosmic Exploration Gazette" },
            { title: "Quantum Computing Hardware achieves Error-Correcting Threshold", desc: "Research teams run algorithms for complex molecules, showing that error-correcting qubits can maintain coherence during sorting cycles.", time: "15 hours ago", source: "Physics Today" }
        ],
        entertainment: [
            { title: "Pop Culture Dashboard Analyzes Anime Character Popularity Metrics", desc: "Data analysts build clean dashboards comparing media traction, YouTube views, and fan engagement indicators.", time: "6 hours ago", source: "Anime Analytics" },
            { title: "Indie Games Drive Storytelling Innovation with Procedural Narrative Engines", desc: "Writing platforms and game editors collaborate on branching choice networks that adapt dialog based on player decisions.", time: "1 day ago", source: "Pixel Play Media" }
        ]
    };

    function initVoiceNews() {
        const categorySelect = document.getElementById('news-category');
        const searchInput = document.getElementById('news-search');
        const fetchBtn = document.getElementById('news-fetch-btn');
        const stopBtn = document.getElementById('news-stop-btn');
        const feedContainer = document.getElementById('news-feed');

        const loadNews = () => {
            const cat = categorySelect.value;
            const query = searchInput.value.toLowerCase().trim();
            feedContainer.innerHTML = '';
            stopSpeech();

            let articles = mockNewsData[cat] || [];
            if (query) {
                // filter articles based on search query
                articles = Object.values(mockNewsData).flat().filter(art => 
                    art.title.toLowerCase().includes(query) || 
                    art.desc.toLowerCase().includes(query)
                );
            }

            if (articles.length === 0) {
                feedContainer.innerHTML = `
                    <div style="text-align:center; padding: 2rem; color: var(--text-muted);">
                        <i data-lucide="info" style="margin-bottom:0.5rem; width:32px; height:32px;"></i>
                        <p>No news articles found for your query. Try another keyword!</p>
                    </div>`;
                refreshIcons();
                return;
            }

            articles.forEach((art, idx) => {
                const card = document.createElement('div');
                card.className = 'news-card';
                card.id = `news-card-${idx}`;
                card.innerHTML = `
                    <div class="news-meta">
                        <span>${art.source}</span>
                        <span>${art.time}</span>
                    </div>
                    <h3 class="news-title">${art.title}</h3>
                    <p class="news-desc">${art.desc}</p>
                    <div class="news-actions">
                        <button class="demo-btn demo-btn-secondary read-aloud-btn" data-index="${idx}">
                            <i data-lucide="volume-2"></i> Read Headline
                        </button>
                        <div class="speaking-indicator">
                            <span class="bar-anim"></span>
                            <span class="bar-anim"></span>
                            <span class="bar-anim"></span>
                            <span class="bar-anim"></span>
                        </div>
                    </div>
                `;
                feedContainer.appendChild(card);
            });

            refreshIcons();

            // Bind Read Aloud Buttons
            feedContainer.querySelectorAll('.read-aloud-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const index = btn.getAttribute('data-index');
                    speakArticle(articles[index], index);
                });
            });
        };

        const speakArticle = (art, index) => {
            stopSpeech();
            if (!window.speechSynthesis) {
                alert("Text-to-Speech is not supported in this browser. Please try another device.");
                return;
            }

            const card = document.getElementById(`news-card-${index}`);
            if (card) card.classList.add('speaking');

            // Speech Text
            const textToSpeak = `${art.title}. From ${art.source}. ${art.desc}`;
            ttsUtterance = new SpeechSynthesisUtterance(textToSpeak);
            
            // Adjust speech settings
            ttsUtterance.rate = 1.0;
            ttsUtterance.pitch = 1.0;

            ttsUtterance.onend = () => {
                if (card) card.classList.remove('speaking');
            };

            ttsUtterance.onerror = () => {
                if (card) card.classList.remove('speaking');
            };

            window.speechSynthesis.speak(ttsUtterance);
        };

        fetchBtn.addEventListener('click', loadNews);
        stopBtn.addEventListener('click', stopSpeech);

        // Initial Load
        loadNews();
    }

    function getVoiceNewsTemplate() {
        return `
            <div class="news-header-box">
                <p style="margin: 0; font-size: 0.95rem; line-height: 1.5;">
                    This simulator acts as a <strong>Python Voice News Reader</strong>. It connects virtual news payloads to the HTML5 <strong>Web Speech Synthesis API</strong>. Select a news feed topic and click <strong>Read Headline</strong> to trigger TTS.
                </p>
                <div class="rename-rule-group" style="margin-top: 0.5rem;">
                    <div class="demo-input-group">
                        <label class="demo-input-label">Select Category</label>
                        <select class="demo-select" id="news-category">
                            <option value="general">General Headlines</option>
                            <option value="tech" selected>Technology & Science</option>
                            <option value="business">Business & Markets</option>
                            <option value="sports">Sports Analytics</option>
                            <option value="science">Cosmology & Quantum</option>
                            <option value="entertainment">Pop Culture & Gaming</option>
                        </select>
                    </div>
                    <div class="demo-input-group">
                        <label class="demo-input-label">Search Keywords</label>
                        <input type="text" class="demo-input-text" id="news-search" placeholder="Type search term...">
                    </div>
                </div>
                <div class="demo-btn-group" style="margin-top: 0.5rem;">
                    <button class="demo-btn demo-btn-primary" id="news-fetch-btn">
                        <i data-lucide="refresh-cw"></i> Fetch Articles
                    </button>
                    <button class="demo-btn demo-btn-secondary" id="news-stop-btn">
                        <i data-lucide="volume-x"></i> Mute Audio
                    </button>
                </div>
            </div>
            <div class="news-feed-container" id="news-feed"></div>
        `;
    }

    // ==========================================================================
    // 2. MEDIA EXTRACTION & GIF SUITE DEMO
    // ==========================================================================
    let extractedFrames = [];

    function initMediaExtract() {
        const fileInput = document.getElementById('media-file');
        const uploadArea = document.getElementById('media-upload-area');
        const demoBtn = document.getElementById('media-demo-btn');
        const extractBtn = document.getElementById('media-extract-btn');
        const compileBtn = document.getElementById('media-compile-btn');
        const frameGrid = document.getElementById('frame-grid');
        const gifResult = document.getElementById('gif-result');
        const progressContainer = document.getElementById('progress-bar-container');
        const progressFill = document.getElementById('progress-bar-fill');

        let videoUrl = null;

        const handleVideoSelect = (file) => {
            if (!file) return;
            if (videoUrl) URL.revokeObjectURL(videoUrl);
            videoUrl = URL.createObjectURL(file);
            document.getElementById('video-status').textContent = `Loaded: ${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB)`;
            extractBtn.disabled = false;
        };

        uploadArea.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => {
            handleVideoSelect(e.target.files[0]);
        });

        // Setup Drag & Drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--secondary)';
        });
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.borderColor = 'var(--border-color)';
        });
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--border-color)';
            if (e.dataTransfer.files.length) {
                handleVideoSelect(e.dataTransfer.files[0]);
            }
        });

        // Demo Video Generator (Virtual simulation of rendering frames)
        demoBtn.addEventListener('click', async () => {
            document.getElementById('video-status').textContent = "Running virtual simulation video (Rotating Neon Box)...";
            extractBtn.disabled = true;
            compileBtn.disabled = true;
            frameGrid.innerHTML = '';
            extractedFrames = [];
            
            progressContainer.style.display = 'block';
            progressFill.style.width = '0%';

            // Generate 10 canvas frames of a rotating neon cube
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = 300;
            tempCanvas.height = 200;
            const ctx = tempCanvas.getContext('2d');

            const totalFrames = 12;
            for (let i = 0; i < totalFrames; i++) {
                if (cancelDemoAnimation) return;
                
                // Draw cool neon cube frame
                ctx.fillStyle = '#0a0a0f';
                ctx.fillRect(0, 0, 300, 200);

                // Grid background
                ctx.strokeStyle = 'rgba(255,255,255,0.05)';
                ctx.lineWidth = 1;
                for (let x = 0; x < 300; x += 20) {
                    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 200); ctx.stroke();
                }
                for (let y = 0; y < 200; y += 20) {
                    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(300, y); ctx.stroke();
                }

                // Rotating boxes
                ctx.save();
                ctx.translate(150, 100);
                ctx.rotate((i * Math.PI * 2) / totalFrames);
                
                // Secondary shadow glow
                ctx.shadowBlur = 15;
                ctx.shadowColor = '#9d4edd';
                ctx.strokeStyle = '#9d4edd';
                ctx.lineWidth = 4;
                ctx.strokeRect(-40, -40, 80, 80);

                ctx.shadowColor = '#ef233c';
                ctx.strokeStyle = '#ef233c';
                ctx.strokeRect(-20, -20, 40, 40);
                
                ctx.restore();

                // Core stamp
                ctx.fillStyle = '#f8f9fa';
                ctx.font = '12px Courier';
                ctx.fillText(`FRAME EXTR. STEP: ${i+1}`, 15, 180);

                const dataUrl = tempCanvas.toDataURL('image/jpeg');
                extractedFrames.push(dataUrl);

                // Add to thumbnails UI
                const thumb = document.createElement('div');
                thumb.className = 'extracted-frame-card';
                thumb.innerHTML = `
                    <img src="${dataUrl}">
                    <span class="frame-index">#${i+1}</span>
                `;
                frameGrid.appendChild(thumb);

                // Progress update
                progressFill.style.width = `${((i + 1) / totalFrames) * 100}%`;
                await sleep(150);
            }

            progressContainer.style.display = 'none';
            compileBtn.disabled = false;
            document.getElementById('video-status').textContent = "12 Frames extracted successfully! Ready to compile GIF.";
        });

        // Capture Frames from Uploaded Video File
        extractBtn.addEventListener('click', async () => {
            if (!videoUrl) return;
            extractBtn.disabled = true;
            compileBtn.disabled = true;
            frameGrid.innerHTML = '';
            extractedFrames = [];

            const video = document.createElement('video');
            video.src = videoUrl;
            video.crossOrigin = 'anonymous';
            video.muted = true;
            video.playsInline = true;

            document.getElementById('video-status').textContent = "Analysing metadata & drawing canvas timeline...";

            video.addEventListener('loadedmetadata', async () => {
                const duration = video.duration;
                const numFrames = 10;
                const interval = duration / numFrames;

                progressContainer.style.display = 'block';
                progressFill.style.width = '0%';

                const captureCanvas = document.createElement('canvas');
                const captureCtx = captureCanvas.getContext('2d');

                for (let i = 0; i < numFrames; i++) {
                    if (cancelDemoAnimation) return;

                    const time = i * interval + 0.1; // Offset slightly
                    video.currentTime = time;

                    await new Promise(resolve => {
                        const onSeek = () => {
                            video.removeEventListener('seeked', onSeek);
                            captureCanvas.width = video.videoWidth || 320;
                            captureCanvas.height = video.videoHeight || 240;
                            
                            // Draw frame
                            captureCtx.drawImage(video, 0, 0, captureCanvas.width, captureCanvas.height);
                            
                            // Capture frame URL
                            const dataUrl = captureCanvas.toDataURL('image/jpeg', 0.8);
                            extractedFrames.push(dataUrl);

                            // Create UI frame card
                            const thumb = document.createElement('div');
                            thumb.className = 'extracted-frame-card';
                            thumb.innerHTML = `
                                <img src="${dataUrl}">
                                <span class="frame-index">#${i+1}</span>
                            `;
                            frameGrid.appendChild(thumb);

                            progressFill.style.width = `${((i + 1) / numFrames) * 100}%`;
                            resolve();
                        };
                        video.addEventListener('seeked', onSeek);
                    });
                }

                progressContainer.style.display = 'none';
                compileBtn.disabled = false;
                extractBtn.disabled = false;
                document.getElementById('video-status').textContent = `${numFrames} Frames extracted from file! Ready to compile.`;
            });

            video.load();
        });

        // Stitch Frames to GIF using gifshot CDN library
        compileBtn.addEventListener('click', () => {
            if (extractedFrames.length === 0) return;
            compileBtn.disabled = true;
            gifResult.innerHTML = `
                <div style="color:var(--text-muted);">
                    <i class="submit-loader" style="display:inline-block; margin-bottom:0.5rem;"></i>
                    <p>Compiling animated GIF payload client-side...</p>
                </div>
            `;

            const frameDelay = parseFloat(document.getElementById('gif-delay').value) || 0.1;
            
            // Check if gifshot is loaded
            if (typeof gifshot !== 'undefined') {
                gifshot.createGIF({
                    images: extractedFrames,
                    gifWidth: 300,
                    gifHeight: 200,
                    interval: frameDelay,
                    numFrames: extractedFrames.length,
                    frameDuration: frameDelay * 10
                }, (obj) => {
                    if (!obj.error) {
                        gifResult.innerHTML = `
                            <img src="${obj.image}" alt="Compiled GIF">
                            <a href="${obj.image}" download="extracted_animation.gif" class="demo-btn demo-btn-primary" style="margin-top: 1rem; width:100%; text-decoration:none;">
                                <i data-lucide="download"></i> Download GIF
                            </a>
                        `;
                        refreshIcons();
                    } else {
                        fallbackGifCompile();
                    }
                    compileBtn.disabled = false;
                });
            } else {
                fallbackGifCompile();
            }
        });

        // Fallback: If CDN fails or runs into issue, run a Canvas Animation loop
        const fallbackGifCompile = () => {
            gifResult.innerHTML = `
                <canvas id="fallback-gif-canvas" width="300" height="200" style="border-radius:4px; max-width:100%; border: 1px solid var(--border-color);"></canvas>
                <p style="color:var(--text-muted); font-size:0.8rem; margin-top:0.5rem;">
                    (Simulated Canvas Player Loop)
                </p>
            `;
            const canvas = document.getElementById('fallback-gif-canvas');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            let currentFrameIdx = 0;
            const frameDelay = parseFloat(document.getElementById('gif-delay').value) * 1000 || 100;

            const playLoop = () => {
                if (cancelDemoAnimation || !document.getElementById('fallback-gif-canvas')) return;
                
                const img = new Image();
                img.onload = () => {
                    ctx.clearRect(0,0,300,200);
                    ctx.drawImage(img, 0, 0, 300, 200);
                    currentFrameIdx = (currentFrameIdx + 1) % extractedFrames.length;
                    setTimeout(playLoop, frameDelay);
                };
                img.src = extractedFrames[currentFrameIdx];
            };
            playLoop();
            compileBtn.disabled = false;
        };
    }

    function getMediaExtractTemplate() {
        return `
            <div class="demo-grid-2">
                <div class="demo-panel-left">
                    <div class="news-header-box" style="background: rgba(239, 35, 60, 0.05); border-color: rgba(239, 35, 60, 0.15);">
                        <p style="margin:0; font-size:0.9rem; line-height: 1.4;">
                            Replicates the <strong>Python OpenCV Image Extraction</strong> tool. Upload an MP4 video (or run the virtual neon canvas simulation) to extract keyframes, adjust speeds, and stitch them into a downloadable GIF!
                        </p>
                    </div>

                    <div class="demo-input-group">
                        <label class="demo-input-label">Select Video File</label>
                        <div class="media-upload-area" id="media-upload-area">
                            <i data-lucide="video"></i>
                            <div>
                                <span style="font-weight:600; display:block;">Click to Upload Video</span>
                                <span style="font-size:0.75rem; color:var(--text-muted);">Supports MP4, WebM up to 10MB</span>
                            </div>
                            <input type="file" id="media-file" accept="video/*" style="display:none;">
                        </div>
                        <p style="font-size:0.8rem; color:var(--primary); margin:0;" id="video-status">No video loaded.</p>
                    </div>

                    <div class="rename-rule-group">
                        <div class="demo-input-group">
                            <label class="demo-input-label">Frame Delay (Seconds)</label>
                            <select class="demo-select" id="gif-delay">
                                <option value="0.05">0.05s (Fast)</option>
                                <option value="0.1" selected>0.1s (Normal)</option>
                                <option value="0.25">0.25s (Medium)</option>
                                <option value="0.5">0.5s (Slow)</option>
                            </select>
                        </div>
                        <div class="demo-input-group" style="justify-content: flex-end;">
                            <button class="demo-btn demo-btn-secondary" id="media-demo-btn" style="height: 42px; margin-top: auto;">
                                <i data-lucide="sparkles"></i> Load Demo Generator
                            </button>
                        </div>
                    </div>

                    <div class="demo-btn-group">
                        <button class="demo-btn demo-btn-primary" id="media-extract-btn" disabled>
                            <i data-lucide="scissors"></i> Extract Frames
                        </button>
                        <button class="demo-btn demo-btn-secondary" id="media-compile-btn" disabled>
                            <i data-lucide="film"></i> Stitch to GIF
                        </button>
                    </div>

                    <div class="progress-bar-container" id="progress-bar-container">
                        <div class="progress-bar-fill" id="progress-bar-fill"></div>
                    </div>
                </div>

                <div class="demo-panel-right">
                    <h3 style="font-size:1rem; font-weight:600; margin-bottom:0.5rem; display:flex; gap:0.5rem; align-items:center;">
                        <i data-lucide="layout-grid" style="color:var(--primary); width:18px;"></i> Extracted Frames Grid
                    </h3>
                    <div class="frame-extract-grid" id="frame-grid">
                        <div style="grid-column: 1/-1; text-align:center; padding: 2rem; color:var(--text-muted); font-size:0.85rem;">
                            No frames extracted yet.
                        </div>
                    </div>

                    <h3 style="font-size:1rem; font-weight:600; margin-top:1rem; margin-bottom:0.5rem; display:flex; gap:0.5rem; align-items:center;">
                        <i data-lucide="image" style="color:var(--secondary); width:18px;"></i> Output GIF Preview
                    </h3>
                    <div class="gif-result-box" id="gif-result">
                        <p style="color:var(--text-muted); font-size:0.85rem;">Stitch frames to review animation.</p>
                    </div>
                </div>
            </div>
        `;
    }

    // ==========================================================================
    // 3. RENAMEIT FILE AUTOMATOR DEMO
    // ==========================================================================
    let virtualFiles = [];

    const filePresets = {
        camera: [
            { name: 'dsc_0083.jpg', size: '3.4 MB', type: 'Image' },
            { name: 'dsc_0084.jpg', size: '2.8 MB', type: 'Image' },
            { name: 'dsc_0085.jpg', size: '3.1 MB', type: 'Image' },
            { name: 'dsc_0086.jpg', size: '2.9 MB', type: 'Image' },
            { name: 'dsc_0087.jpg', size: '3.2 MB', type: 'Image' }
        ],
        music: [
            { name: 'track_01.mp3', size: '7.4 MB', type: 'Audio' },
            { name: 'track_02.mp3', size: '6.8 MB', type: 'Audio' },
            { name: 'track_03.mp3', size: '8.2 MB', type: 'Audio' },
            { name: 'track_04.mp3', size: '7.9 MB', type: 'Audio' }
        ],
        logs: [
            { name: 'temp_log_1034.tmp', size: '120 KB', type: 'System Log' },
            { name: 'temp_log_1035.tmp', size: '94 KB', type: 'System Log' },
            { name: 'temp_log_1036.tmp', size: '110 KB', type: 'System Log' },
            { name: 'temp_log_1037.tmp', size: '88 KB', type: 'System Log' }
        ]
    };

    function initRenameIt() {
        const fileCountSelect = document.getElementById('rename-count');
        const presetSelect = document.getElementById('rename-preset');
        
        const prefixInput = document.getElementById('rename-prefix');
        const basenameInput = document.getElementById('rename-base');
        const startInput = document.getElementById('rename-start');
        const paddingSelect = document.getElementById('rename-padding');
        const extInput = document.getElementById('rename-ext');

        const tableBody = document.getElementById('rename-table-body');
        const previewBtn = document.getElementById('rename-preview-btn');
        const executeBtn = document.getElementById('rename-execute-btn');
        const resetBtn = document.getElementById('rename-reset-btn');
        const progressContainer = document.getElementById('rename-progress-container');
        const progressFill = document.getElementById('rename-progress-fill');

        const loadFiles = () => {
            const count = parseInt(fileCountSelect.value);
            const preset = presetSelect.value;
            const baseList = filePresets[preset] || filePresets.camera;
            
            virtualFiles = [];
            for (let i = 0; i < count; i++) {
                const baseFile = baseList[i % baseList.length];
                // Make name sequential
                const fileNum = i + 1;
                const dotIdx = baseFile.name.lastIndexOf('.');
                const namePart = baseFile.name.substring(0, dotIdx);
                const extPart = baseFile.name.substring(dotIdx);
                const sequentialName = `${namePart.substring(0, namePart.lastIndexOf('_') + 1 || namePart.length)}${fileNum}${extPart}`;

                virtualFiles.push({
                    name: sequentialName,
                    size: baseFile.size,
                    type: baseFile.type,
                    currentName: sequentialName,
                    status: 'original'
                });
            }
            renderTable();
        };

        const renderTable = () => {
            tableBody.innerHTML = '';
            virtualFiles.forEach(file => {
                let statusBadge = '';
                if (file.status === 'original') {
                    statusBadge = '<span class="file-status-badge file-status-original">Original Matrix</span>';
                } else if (file.status === 'preview') {
                    statusBadge = '<span class="file-status-badge file-status-modified">Preview</span>';
                } else if (file.status === 'success') {
                    statusBadge = '<span class="file-status-badge file-status-success">Renamed</span>';
                }

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td style="font-family:monospace; color:var(--text-muted);">${file.name}</td>
                    <td style="font-family:monospace; font-weight:600; color:var(--text-primary);">${file.currentName}</td>
                    <td>${statusBadge}</td>
                    <td style="color:var(--text-muted);">${file.size}</td>
                `;
                tableBody.appendChild(tr);
            });
        };

        const applyRules = (commit = false) => {
            const prefix = prefixInput.value;
            const basename = basenameInput.value.trim();
            const startNum = parseInt(startInput.value) || 1;
            const padding = parseInt(paddingSelect.value) || 3;
            const newExt = extInput.value.trim();

            virtualFiles.forEach((file, index) => {
                let extPart = file.name.substring(file.name.lastIndexOf('.')) || '';
                if (newExt) {
                    extPart = newExt.startsWith('.') ? newExt : '.' + newExt;
                }

                // Base naming core
                let namePart = basename;
                if (!namePart) {
                    // Fallback to original name without extension if base name is empty
                    namePart = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
                }

                // Add Serial index numbering
                const indexStr = String(startNum + index).padStart(padding, '0');
                let finalName = `${namePart}_${indexStr}`;
                
                // Add prefix
                if (prefix) {
                    finalName = prefix + finalName;
                }

                file.currentName = finalName + extPart;
                file.status = commit ? 'success' : 'preview';
            });

            renderTable();
        };

        // Bind update changes dynamically
        [prefixInput, basenameInput, startInput, paddingSelect, extInput].forEach(input => {
            input.addEventListener('input', () => applyRules(false));
        });
        fileCountSelect.addEventListener('change', loadFiles);
        presetSelect.addEventListener('change', loadFiles);

        previewBtn.addEventListener('click', () => applyRules(false));

        executeBtn.addEventListener('click', async () => {
            executeBtn.disabled = true;
            previewBtn.disabled = true;
            resetBtn.disabled = true;

            const total = virtualFiles.length;
            progressContainer.style.display = 'block';
            progressFill.style.width = '0%';

            // Run in sequential batches of 10 items to show fast automation
            const batchSize = Math.max(1, Math.floor(total / 10));
            for (let i = 0; i < total; i += batchSize) {
                if (cancelDemoAnimation) return;

                // Rename batch files
                for (let k = i; k < Math.min(total, i + batchSize); k++) {
                    applyRules(true);
                    virtualFiles[k].name = virtualFiles[k].currentName;
                    virtualFiles[k].status = 'success';
                }

                renderTable();
                progressFill.style.width = `${((i + batchSize) / total) * 100}%`;
                await sleep(100);
            }

            progressContainer.style.display = 'none';
            executeBtn.disabled = false;
            previewBtn.disabled = false;
            resetBtn.disabled = false;
        });

        resetBtn.addEventListener('click', () => {
            prefixInput.value = '';
            basenameInput.value = 'image';
            startInput.value = '1';
            paddingSelect.value = '3';
            extInput.value = '';
            fileCountSelect.value = '50';
            presetSelect.value = 'camera';
            loadFiles();
        });

        // Initial Load
        loadFiles();
    }

    function getRenameItTemplate() {
        return `
            <div class="demo-grid-2">
                <div class="demo-panel-left">
                    <div class="news-header-box" style="background: rgba(157, 78, 221, 0.05); border-color: rgba(157, 78, 221, 0.15);">
                        <p style="margin:0; font-size:0.9rem; line-height: 1.4;">
                            A premium simulator designed for <strong>bulk serial file renaming</strong>. Replicates a <strong>Python batch OS utility</strong>. Setup rules to rename hundreds of files sequentially in seconds.
                        </p>
                    </div>

                    <div class="rules-container">
                        <h4 style="font-size: 0.95rem; font-weight: 700; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; margin-bottom: 0.25rem;">
                            <i data-lucide="sliders" style="width: 16px; display:inline-block; vertical-align:middle; margin-right: 4px;"></i> Bulk Rule Configurator
                        </h4>

                        <div class="rename-rule-group">
                            <div class="demo-input-group">
                                <label class="demo-input-label">Base Name</label>
                                <input type="text" class="demo-input-text" id="rename-base" value="image" placeholder="e.g. vacation">
                            </div>
                            <div class="demo-input-group">
                                <label class="demo-input-label">Force Extension</label>
                                <input type="text" class="demo-input-text" id="rename-ext" placeholder="e.g. jpg">
                            </div>
                        </div>

                        <div class="rename-rule-group">
                            <div class="demo-input-group">
                                <label class="demo-input-label">Add Prefix</label>
                                <input type="text" class="demo-input-text" id="rename-prefix" placeholder="e.g. NYC_">
                            </div>
                            <div class="demo-input-group">
                                <label class="demo-input-label">Number Start Index</label>
                                <input type="number" class="demo-input-text" id="rename-start" value="1" min="1">
                            </div>
                        </div>

                        <div class="rename-rule-group">
                            <div class="demo-input-group">
                                <label class="demo-input-label">Serial Padding (Digits)</label>
                                <select class="demo-select" id="rename-padding">
                                    <option value="2">2 digits (e.g. _01)</option>
                                    <option value="3" selected>3 digits (e.g. _001)</option>
                                    <option value="4">4 digits (e.g. _0001)</option>
                                </select>
                            </div>
                            <div class="demo-input-group">
                                <label class="demo-input-label">File Count to Simulate</label>
                                <select class="demo-select" id="rename-count">
                                    <option value="10">10 Files</option>
                                    <option value="50" selected>50 Files</option>
                                    <option value="100">100 Files</option>
                                    <option value="500">500 Files</option>
                                </select>
                            </div>
                        </div>

                        <div class="demo-input-group">
                            <label class="demo-input-label">Source File Preset</label>
                            <select class="demo-select" id="rename-preset">
                                <option value="camera" selected>Camera Photos (dsc_0083.jpg)</option>
                                <option value="music">Music Tracks (track_01.mp3)</option>
                                <option value="logs">Raw System Logs (temp_log.tmp)</option>
                            </select>
                        </div>
                    </div>

                    <div class="demo-btn-group">
                        <button class="demo-btn demo-btn-secondary" id="rename-preview-btn">
                            <i data-lucide="eye"></i> Preview
                        </button>
                        <button class="demo-btn demo-btn-primary" id="rename-execute-btn">
                            <i data-lucide="terminal"></i> Execute Bulk Rename
                        </button>
                        <button class="demo-btn demo-btn-secondary" id="rename-reset-btn">
                            <i data-lucide="rotate-ccw"></i> Reset Rules
                        </button>
                    </div>

                    <div class="progress-bar-container" id="rename-progress-container">
                        <div class="progress-bar-fill" id="rename-progress-fill"></div>
                    </div>
                </div>

                <div class="demo-panel-right">
                    <h3 style="font-size:1rem; font-weight:600; margin-bottom:0.5rem; display:flex; gap:0.5rem; align-items:center;">
                        <i data-lucide="hard-drive" style="color:var(--primary); width:18px;"></i> Virtual Directory Explorer
                    </h3>
                    <div class="rename-table-wrapper" style="max-height:360px; overflow-y:auto;">
                        <table class="rename-table">
                            <thead>
                                <tr>
                                    <th>Original Name</th>
                                    <th>New Name Output</th>
                                    <th>Status</th>
                                    <th>Size</th>
                                </tr>
                            </thead>
                            <tbody id="rename-table-body"></tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    // ==========================================================================
    // 4. ROCK PAPER SCISSORS GAME DEMO
    // ==========================================================================
    let rpsScore = { user: 0, computer: 0, ties: 0 };
    const rpsMoves = [
        { name: 'Stone', emoji: '🪨', index: 0 },
        { name: 'Paper', emoji: '📄', index: 1 },
        { name: 'Scissor', emoji: '✂️', index: 2 }
    ];

    function initRockPaperScissors() {
        const choiceCards = document.querySelectorAll('.rps-choice-card');
        const userHand = document.getElementById('user-hand');
        const compHand = document.getElementById('comp-hand');
        const userScoreVal = document.getElementById('user-score-val');
        const compScoreVal = document.getElementById('comp-score-val');
        const tieScoreVal = document.getElementById('tie-score-val');
        const resultText = document.getElementById('rps-result');
        const resetBtn = document.getElementById('rps-reset-btn');

        choiceCards.forEach(card => {
            card.addEventListener('click', async () => {
                if (cancelDemoAnimation) return;
                const userChoiceIdx = parseInt(card.getAttribute('data-choice'));

                // Play shake animation
                userHand.textContent = '✊';
                compHand.textContent = '✊';
                userHand.classList.add('shake');
                compHand.classList.add('shake');
                resultText.textContent = 'Stone... Paper... Scissor...';
                resultText.className = 'rps-result-text';

                await sleep(800);

                userHand.classList.remove('shake');
                compHand.classList.remove('shake');

                const compChoiceIdx = Math.floor(Math.random() * 3);
                
                // Set final hand emojis
                userHand.textContent = rpsMoves[userChoiceIdx].emoji;
                compHand.textContent = rpsMoves[compChoiceIdx].emoji;

                // Determine Winner
                if (userChoiceIdx === compChoiceIdx) {
                    rpsScore.ties++;
                    tieScoreVal.textContent = rpsScore.ties;
                    resultText.textContent = "It's a Tie! 🤝";
                    resultText.className = 'rps-result-text rps-tie';
                } else if (
                    (userChoiceIdx === 0 && compChoiceIdx === 2) || // Rock beats Scissors
                    (userChoiceIdx === 1 && compChoiceIdx === 0) || // Paper beats Rock
                    (userChoiceIdx === 2 && compChoiceIdx === 1)    // Scissors beats Paper
                ) {
                    rpsScore.user++;
                    userScoreVal.textContent = rpsScore.user;
                    resultText.textContent = "You Win! 🎉";
                    resultText.className = 'rps-result-text rps-win';
                } else {
                    rpsScore.computer++;
                    compScoreVal.textContent = rpsScore.computer;
                    resultText.textContent = "Computer Wins! 💻";
                    resultText.className = 'rps-result-text rps-lose';
                }
            });
        });

        resetBtn.addEventListener('click', () => {
            rpsScore = { user: 0, computer: 0, ties: 0 };
            userScoreVal.textContent = '0';
            compScoreVal.textContent = '0';
            tieScoreVal.textContent = '0';
            userHand.textContent = '✊';
            compHand.textContent = '✊';
            resultText.textContent = 'Choose your move to start!';
            resultText.className = 'rps-result-text';
        });
    }

    function getRockPaperScissorsTemplate() {
        return `
            <div class="rps-container">
                <div class="news-header-box" style="background: rgba(239, 35, 60, 0.05); border-color: rgba(239, 35, 60, 0.15); width: 100%; max-width: 450px; text-align: center;">
                    <p style="margin:0; font-size:0.9rem; line-height: 1.4;">
                        A fully interactive browser simulator of the <strong>Python Rock Paper Scissors (Stone Paper Scissor)</strong> project. Try your luck against the randomized computer choices!
                    </p>
                </div>

                <div class="rps-scoreboard">
                    <div class="rps-score-box">
                        <h4>Player</h4>
                        <div class="rps-score-num" id="user-score-val">0</div>
                    </div>
                    <div class="rps-score-box">
                        <h4>Ties</h4>
                        <div class="rps-score-num" style="color:var(--text-muted);" id="tie-score-val">0</div>
                    </div>
                    <div class="rps-score-box">
                        <h4>Computer</h4>
                        <div class="rps-score-num" style="color:var(--primary);" id="comp-score-val">0</div>
                    </div>
                </div>

                <div class="rps-arena-panel">
                    <div class="rps-hand-wrapper">
                        <span class="rps-hand-label">Your Hand</span>
                        <span class="rps-hand-display" id="user-hand">✊</span>
                    </div>
                    <span class="rps-vs-sign">VS</span>
                    <div class="rps-hand-wrapper">
                        <span class="rps-hand-label">Computer Hand</span>
                        <span class="rps-hand-display" id="comp-hand">✊</span>
                    </div>
                </div>

                <div class="rps-result-text" id="rps-result">Choose your move to start!</div>

                <div class="rps-choices-grid">
                    <button class="rps-choice-card" data-choice="0">
                        <span class="rps-choice-emoji">🪨</span>
                        <span style="font-size: 0.85rem; font-weight: 700;">Stone</span>
                    </button>
                    <button class="rps-choice-card" data-choice="1">
                        <span class="rps-choice-emoji">📄</span>
                        <span style="font-size: 0.85rem; font-weight: 700;">Paper</span>
                    </button>
                    <button class="rps-choice-card" data-choice="2">
                        <span class="rps-choice-emoji">✂️</span>
                        <span style="font-size: 0.85rem; font-weight: 700;">Scissor</span>
                    </button>
                </div>

                <button class="demo-btn demo-btn-secondary" id="rps-reset-btn" style="margin-top: 0.5rem;">
                    <i data-lucide="rotate-ccw"></i> Reset Scores
                </button>
            </div>
        `;
    }

    // ==========================================================================
    // 5. VIDEO CAPTION MERGER DEMO
    // ==========================================================================
    let captionInterval = null;
    let videoIsPlaying = false;
    let videoTime = 0.0;
    let maxVideoTime = 12.0;
    let isRealVideoMode = false;

    let srtTracks = [
        { start: 0.0, end: 2.5, text: "Hello! I am Nikhil Kumar, a developer." },
        { start: 2.5, end: 5.5, text: "Today we are building high performance python scripts." },
        { start: 5.5, end: 8.5, text: "This OpenCV script draws neat outlines around letters!" },
        { start: 8.5, end: 12.0, text: "It highlights words one by one during video playback!" }
    ];

    function parseSRT(text) {
        const cleanText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        const parts = cleanText.split('\n\n');
        const tracks = [];

        parts.forEach(part => {
            const lines = part.trim().split('\n');
            if (lines.length >= 2) {
                let timeLineIndex = -1;
                for (let i = 0; i < lines.length; i++) {
                    if (lines[i].includes('-->')) {
                        timeLineIndex = i;
                        break;
                    }
                }
                if (timeLineIndex !== -1) {
                    const times = lines[timeLineIndex].split('-->');
                    if (times.length === 2) {
                        const start = parseTimestamp(times[0].trim());
                        const end = parseTimestamp(times[1].trim());
                        const textLines = lines.slice(timeLineIndex + 1).join(' ');
                        const cleanSegmentText = textLines.replace(/<[^>]*>/g, '').trim();
                        if (!isNaN(start) && !isNaN(end) && cleanSegmentText) {
                            tracks.push({ start, end, text: cleanSegmentText });
                        }
                    }
                }
            }
        });

        return tracks;
    }

    function parseTimestamp(timeString) {
        const parts = timeString.replace(',', '.').split(':');
        if (parts.length !== 3) return NaN;
        const hours = parseInt(parts[0], 10);
        const minutes = parseInt(parts[1], 10);
        const seconds = parseFloat(parts[2]);
        return hours * 3600 + minutes * 60 + seconds;
    }

    function drawCanvasSubtitles(ctx, width, height, activeTrack, videoTime, size, color, strokeColor, strokeWidth, highlightColor, positionYPct) {
        if (!activeTrack) return;
        
        const fontSize = parseInt(size, 10) || 26;
        const stroke = parseInt(strokeWidth, 10) || 4;
        const y = positionYPct * height;
        
        ctx.font = `bold ${fontSize}px 'Outfit', 'Inter', sans-serif`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        
        const words = activeTrack.text.split(' ');
        const duration = Math.max(0.1, activeTrack.end - activeTrack.start);
        const timeElapsed = Math.max(0, videoTime - activeTrack.start);
        const activeWordIndex = Math.min(words.length - 1, Math.floor((timeElapsed / duration) * words.length));
        
        const wordWidths = words.map(w => ctx.measureText(w + ' ').width);
        const totalWidth = wordWidths.reduce((a, b) => a + b, 0) - ctx.measureText(' ').width;
        
        let currentX = (width / 2) - (totalWidth / 2);
        
        words.forEach((w, wIdx) => {
            const isHighlighted = (wIdx === activeWordIndex);
            ctx.fillStyle = isHighlighted ? highlightColor : color;
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = stroke;
            
            ctx.strokeText(w, currentX, y);
            ctx.fillText(w, currentX, y);
            
            currentX += wordWidths[wIdx];
        });
    }

    function initVideoCaption() {
        if (captionInterval) {
            clearInterval(captionInterval);
            captionInterval = null;
        }

        isRealVideoMode = false;
        videoIsPlaying = false;
        videoTime = 0.0;
        maxVideoTime = 12.0;
        srtTracks = [
            { start: 0.0, end: 2.5, text: "Hello! I am Nikhil Kumar, a developer." },
            { start: 2.5, end: 5.5, text: "Today we are building high performance python scripts." },
            { start: 5.5, end: 8.5, text: "This OpenCV script draws neat outlines around letters!" },
            { start: 8.5, end: 12.0, text: "It highlights words one by one during video playback!" }
        ];

        const playBtn = document.getElementById('cap-play-btn');
        const renderBtn = document.getElementById('cap-render-btn');
        const srtContainer = document.getElementById('cap-srt-list');
        const overlayText = document.getElementById('cap-overlay');
        const progressFill = document.getElementById('cap-progress-fill');
        const timerText = document.getElementById('cap-timer');
        const sizeInput = document.getElementById('cap-size');
        const colorInput = document.getElementById('cap-color');
        const strokeInput = document.getElementById('cap-stroke');
        const highlightInput = document.getElementById('cap-highlight');
        const positionInput = document.getElementById('cap-position');
        const canvas = document.getElementById('cap-video-canvas');
        const ctx = canvas ? canvas.getContext('2d') : null;

        const videoElement = document.getElementById('cap-video-element');
        const videoUpload = document.getElementById('cap-video-upload');
        const videoUploadBtn = document.getElementById('cap-video-upload-btn');
        const videoFilename = document.getElementById('cap-video-filename');
        const srtUpload = document.getElementById('cap-srt-upload');
        const srtUploadBtn = document.getElementById('cap-srt-upload-btn');
        const srtFilename = document.getElementById('cap-srt-filename');
        const progressContainer = document.getElementById('cap-progress-container');

        if (videoUploadBtn && videoUpload) {
            videoUploadBtn.addEventListener('click', () => videoUpload.click());
        }
        if (srtUploadBtn && srtUpload) {
            srtUploadBtn.addEventListener('click', () => srtUpload.click());
        }

        if (videoUpload) {
            videoUpload.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    videoFilename.textContent = file.name;
                    const objectURL = URL.createObjectURL(file);
                    if (videoElement) {
                        videoElement.src = objectURL;
                        videoElement.style.display = 'block';
                    }
                    if (canvas) {
                        canvas.style.display = 'none';
                    }
                    isRealVideoMode = true;
                    if (videoIsPlaying) {
                        playVideo();
                    }
                    videoTime = 0.0;
                    if (videoElement) videoElement.currentTime = 0;
                    progressFill.style.width = '0%';
                    timerText.textContent = `0.0s / ...`;
                }
            });
        }

        if (videoElement) {
            videoElement.addEventListener('loadedmetadata', () => {
                maxVideoTime = videoElement.duration;
                timerText.textContent = `0.0s / ${maxVideoTime.toFixed(0)}s`;
                updateCaptions();
            });

            videoElement.addEventListener('ended', () => {
                if (videoIsPlaying) {
                    playVideo();
                }
                videoTime = 0.0;
                videoElement.currentTime = 0;
                progressFill.style.width = '0%';
                timerText.textContent = `0.0s / ${maxVideoTime.toFixed(0)}s`;
                updateCaptions();
            });
        }

        if (srtUpload) {
            srtUpload.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    srtFilename.textContent = file.name;
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const parsed = parseSRT(event.target.result);
                        if (parsed && parsed.length > 0) {
                            srtTracks = parsed;
                            if (!isRealVideoMode) {
                                const lastTrack = srtTracks[srtTracks.length - 1];
                                maxVideoTime = lastTrack.end;
                            }
                            renderSRTList();
                            videoTime = 0.0;
                            if (isRealVideoMode && videoElement) {
                                videoElement.currentTime = 0;
                            }
                            progressFill.style.width = '0%';
                            timerText.textContent = `0.0s / ${maxVideoTime.toFixed(0)}s`;
                            if (!isRealVideoMode) {
                                drawVideoSimulation();
                            }
                            updateCaptions();
                        } else {
                            alert("Could not parse SRT file. Please verify it is a valid subtitle format.");
                        }
                    };
                    reader.readAsText(file);
                }
            });
        }

        if (progressContainer) {
            progressContainer.addEventListener('click', (e) => {
                const rect = progressContainer.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const width = rect.width;
                const pct = Math.max(0, Math.min(1, clickX / width));
                const targetTime = pct * maxVideoTime;
                
                videoTime = targetTime;
                if (isRealVideoMode && videoElement) {
                    videoElement.currentTime = targetTime;
                }
                progressFill.style.width = `${pct * 100}%`;
                timerText.textContent = `${videoTime.toFixed(1)}s / ${maxVideoTime.toFixed(0)}s`;
                if (!isRealVideoMode) {
                    drawVideoSimulation();
                }
                updateCaptions();
            });
        }

        const renderSRTList = () => {
            srtContainer.innerHTML = '';
            srtTracks.forEach((track, index) => {
                const item = document.createElement('div');
                item.className = 'caption-segment-item';
                item.id = `cap-seg-${index}`;
                item.innerHTML = `
                    <span class="caption-segment-time">${track.start.toFixed(1)}s - ${track.end.toFixed(1)}s</span>
                    <input type="text" class="caption-segment-input" data-index="${index}" value="${track.text}">
                `;
                srtContainer.appendChild(item);
            });

            srtContainer.querySelectorAll('.caption-segment-input').forEach(input => {
                input.addEventListener('input', (e) => {
                    const idx = parseInt(input.getAttribute('data-index'));
                    srtTracks[idx].text = input.value;
                });
            });
        };

        const drawVideoSimulation = () => {
            if (!ctx) return;
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(0, 0, 480, 270);

            ctx.save();
            ctx.translate(240, 135);
            ctx.rotate(videoTime * 0.5);

            ctx.fillStyle = 'rgba(157, 78, 221, 0.25)';
            ctx.beginPath(); ctx.arc(-80, 0, 40 + Math.sin(videoTime * 2) * 10, 0, Math.PI * 2); ctx.fill();

            ctx.fillStyle = 'rgba(239, 35, 60, 0.2)';
            ctx.beginPath(); ctx.arc(80, 0, 30 + Math.cos(videoTime * 2) * 10, 0, Math.PI * 2); ctx.fill();
            ctx.restore();

            ctx.strokeStyle = 'rgba(255,255,255,0.03)';
            ctx.lineWidth = 1;
            for (let i = 0; i < 480; i += 30) {
                ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 270); ctx.stroke();
            }

            ctx.fillStyle = '#f8f9fa';
            ctx.font = '10px Courier';
            ctx.fillText(`FRAME EXTR. TIME: ${videoTime.toFixed(2)}s / ${maxVideoTime.toFixed(2)}s`, 20, 250);
            ctx.fillText(`API: cv2.putText() + PIL.ImageDraw()`, 20, 235);

            const activeTrack = srtTracks.find(t => videoTime >= t.start && videoTime <= t.end);
            if (activeTrack) {
                drawCanvasSubtitles(
                    ctx, 480, 270, activeTrack, videoTime, 
                    sizeInput.value, colorInput.value, '#000000', 
                    strokeInput.value, highlightInput.value, parseFloat(positionInput.value)
                );
            }
        };

        const updateCaptions = () => {
            const activeTrack = srtTracks.find(t => videoTime >= t.start && videoTime <= t.end);
            srtContainer.querySelectorAll('.caption-segment-item').forEach(item => item.classList.remove('active'));

            if (!activeTrack) {
                overlayText.innerHTML = '';
                return;
            }

            const activeIndex = srtTracks.indexOf(activeTrack);
            const activeSegmentEl = document.getElementById(`cap-seg-${activeIndex}`);
            if (activeSegmentEl) activeSegmentEl.classList.add('active');

            overlayText.style.fontSize = `${sizeInput.value}px`;
            overlayText.style.color = colorInput.value;
            overlayText.style.top = `${positionInput.value * 100}%`;

            const strokeWidth = strokeInput.value;
            const strokeColor = '#000000';
            let shadows = [];
            for (let dx = -strokeWidth; dx <= strokeWidth; dx += 2) {
                for (let dy = -strokeWidth; dy <= strokeWidth; dy += 2) {
                    shadows.push(`${dx}px ${dy}px 0 ${strokeColor}`);
                }
            }
            overlayText.style.textShadow = shadows.join(',');

            const words = activeTrack.text.split(' ');
            const duration = activeTrack.end - activeTrack.start;
            const timeElapsed = videoTime - activeTrack.start;
            const activeWordIndex = Math.floor((timeElapsed / duration) * words.length);

            overlayText.innerHTML = '';
            words.forEach((w, wIdx) => {
                const span = document.createElement('span');
                span.className = 'caption-word-span';
                span.textContent = w;
                if (wIdx === activeWordIndex) {
                    span.classList.add('highlighted');
                    span.style.color = highlightInput.value;
                }
                overlayText.appendChild(span);
            });
        };

        const playVideo = () => {
            if (videoIsPlaying) {
                clearInterval(captionInterval);
                videoIsPlaying = false;
                playBtn.innerHTML = '<i data-lucide="play"></i> Play Video';
                refreshIcons();
                if (isRealVideoMode && videoElement) {
                    videoElement.pause();
                }
            } else {
                videoIsPlaying = true;
                playBtn.innerHTML = '<i data-lucide="pause"></i> Pause Video';
                refreshIcons();
                if (isRealVideoMode && videoElement) {
                    videoElement.play();
                }

                const tick = 50;
                captionInterval = setInterval(() => {
                    if (cancelDemoAnimation) {
                        clearInterval(captionInterval);
                        if (isRealVideoMode && videoElement) {
                            videoElement.pause();
                        }
                        videoIsPlaying = false;
                        playBtn.innerHTML = '<i data-lucide="play"></i> Play Video';
                        refreshIcons();
                        return;
                    }

                    if (isRealVideoMode && videoElement) {
                        videoTime = videoElement.currentTime;
                    } else {
                        videoTime += tick / 1000;
                        if (videoTime >= maxVideoTime) {
                            videoTime = 0.0;
                        }
                    }

                    const pct = (videoTime / maxVideoTime) * 100;
                    progressFill.style.width = `${pct}%`;
                    timerText.textContent = `${videoTime.toFixed(1)}s / ${maxVideoTime.toFixed(0)}s`;

                    if (!isRealVideoMode) {
                        drawVideoSimulation();
                    }
                    updateCaptions();
                }, tick);
            }
        };

        playBtn.addEventListener('click', playVideo);

        renderBtn.addEventListener('click', () => {
            renderBtn.disabled = true;
            playBtn.disabled = true;
            if (videoIsPlaying) playVideo();

            const resultContainer = document.getElementById('cap-render-result');
            resultContainer.style.display = 'block';
            resultContainer.innerHTML = `
                <div style="font-size:0.85rem; color:var(--text-muted);">
                    <i class="submit-loader" style="display:inline-block; margin-bottom:0.5rem;"></i>
                    <p id="cap-render-status">Initializing subtitle merger stream...</p>
                </div>
            `;

            videoTime = 0.0;
            if (isRealVideoMode && videoElement) {
                videoElement.currentTime = 0;
                videoElement.style.display = 'none';
            }
            canvas.style.display = 'block';

            const chunks = [];
            const canvasStream = canvas.captureStream(30);
            let recorderStream = canvasStream;
            let audioContext = null;
            let mediaDest = null;

            if (isRealVideoMode && videoElement) {
                try {
                    audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    const audioSource = audioContext.createMediaElementSource(videoElement);
                    mediaDest = audioContext.createMediaStreamDestination();
                    audioSource.connect(mediaDest);
                    audioSource.connect(audioContext.destination);
                    
                    const audioTrack = mediaDest.stream.getAudioTracks()[0];
                    if (audioTrack) {
                        recorderStream = new MediaStream([
                            ...canvasStream.getVideoTracks(),
                            audioTrack
                        ]);
                    }
                } catch (e) {
                    console.warn("Could not capture audio stream: ", e);
                }
            }

            let options = { mimeType: 'video/webm;codecs=vp9' };
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                options = { mimeType: 'video/webm' };
            }
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                options = { mimeType: 'video/mp4' };
            }
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                options = {};
            }

            let mediaRecorder = null;
            try {
                mediaRecorder = new MediaRecorder(recorderStream, options);
            } catch (e) {
                console.error("Failed to create MediaRecorder: ", e);
            }

            if (mediaRecorder) {
                mediaRecorder.ondataavailable = (e) => {
                    if (e.data && e.data.size > 0) {
                        chunks.push(e.data);
                    }
                };

                mediaRecorder.onstop = () => {
                    const videoName = isRealVideoMode && videoUpload.files[0] ? videoUpload.files[0].name : "simulation.mp4";
                    const blob = new Blob(chunks, { type: 'video/webm' });
                    const downloadUrl = URL.createObjectURL(blob);
                    
                    resultContainer.innerHTML = `
                        <div style="color:#10b981; font-weight:bold; font-size:0.9rem; margin-bottom: 0.5rem;">
                            <i data-lucide="check-circle-2" style="display:inline-block; vertical-align:middle; margin-right:4px;"></i> 
                            Video with merged captions generated successfully!
                        </div>
                        <p style="font-size:0.75rem; color:var(--text-muted); margin-bottom: 0.5rem;">
                            Merged captions from ${isRealVideoMode && srtUpload.files[0] ? srtUpload.files[0].name : "subtitles.srt"} onto ${videoName}.
                        </p>
                        <a href="${downloadUrl}" download="subtitled_${videoName.replace(/\s+/g, '_')}.webm" class="demo-btn demo-btn-primary" style="display: inline-flex; width: 100%; justify-content: center; align-items: center; gap: 8px;">
                            <i data-lucide="download"></i> Download Video
                        </a>
                    `;
                    refreshIcons();
                    renderBtn.disabled = false;
                    playBtn.disabled = false;

                    if (isRealVideoMode && videoElement) {
                        videoElement.style.display = 'block';
                        canvas.style.display = 'none';
                    }
                };

                mediaRecorder.start();
            }

            videoIsPlaying = true;
            if (isRealVideoMode && videoElement) {
                videoElement.play();
            }

            const tick = 50;
            captionInterval = setInterval(() => {
                if (cancelDemoAnimation) {
                    clearInterval(captionInterval);
                    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
                        mediaRecorder.stop();
                    }
                    if (isRealVideoMode && videoElement) {
                        videoElement.pause();
                    }
                    videoIsPlaying = false;
                    return;
                }

                if (isRealVideoMode && videoElement) {
                    videoTime = videoElement.currentTime;
                    if (ctx) {
                        ctx.drawImage(videoElement, 0, 0, 480, 270);
                    }
                } else {
                    videoTime += tick / 1000;
                    if (!isRealVideoMode) {
                        drawVideoSimulation();
                    }
                }

                const activeTrack = srtTracks.find(t => videoTime >= t.start && videoTime <= t.end);
                if (activeTrack && ctx) {
                    drawCanvasSubtitles(
                        ctx, 480, 270, activeTrack, videoTime, 
                        sizeInput.value, colorInput.value, '#000000', 
                        strokeInput.value, highlightInput.value, parseFloat(positionInput.value)
                    );
                }

                const pct = (videoTime / maxVideoTime) * 100;
                progressFill.style.width = `${pct}%`;
                timerText.textContent = `${videoTime.toFixed(1)}s / ${maxVideoTime.toFixed(0)}s`;
                
                document.getElementById('cap-render-status').textContent = `[Processing] Merging outlined captions... ${Math.min(100, Math.floor(pct))}%`;

                if (videoTime >= maxVideoTime) {
                    clearInterval(captionInterval);
                    if (isRealVideoMode && videoElement) {
                        videoElement.pause();
                    }
                    videoIsPlaying = false;
                    playBtn.innerHTML = '<i data-lucide="play"></i> Play Video';
                    refreshIcons();

                    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
                        mediaRecorder.stop();
                    }
                } else {
                    updateCaptions();
                }
            }, tick);
        });

        [sizeInput, colorInput, strokeInput, highlightInput, positionInput].forEach(ctrl => {
            ctrl.addEventListener('input', () => {
                updateCaptions();
            });
        });

        renderSRTList();
        drawVideoSimulation();
        updateCaptions();
    }

    function getVideoCaptionTemplate() {
        return `
            <div class="demo-grid-2">
                <div class="demo-panel-left">
                    <div class="news-header-box" style="background: rgba(157, 78, 221, 0.05); border-color: rgba(157, 78, 221, 0.15);">
                        <p style="margin:0; font-size:0.85rem; line-height: 1.4;">
                            Simulates the <strong>Python OpenCV Subtitle Merger</strong>. Parses an SRT file and overlays outline-stroked captions on target frames, highlighting active words in real-time.
                        </p>
                    </div>

                    <div class="rules-container" style="padding: 1rem; gap:0.75rem; margin-bottom: 0.75rem;">
                        <h4 style="font-size: 0.9rem; font-weight: 700; border-bottom: 1px solid var(--border-color); padding-bottom: 0.25rem; margin-bottom: 0.25rem;">
                            <i data-lucide="upload" style="width: 16px; display:inline-block; vertical-align:middle; margin-right: 4px;"></i> 1. Upload Video & Subtitles
                        </h4>
                        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                            <div>
                                <label class="demo-input-label" style="margin-bottom: 4px; display: block;">Select Video File</label>
                                <input type="file" id="cap-video-upload" accept="video/*" style="display: none;">
                                <button class="demo-btn demo-btn-secondary" id="cap-video-upload-btn" style="width: 100%; justify-content: flex-start; text-align: left;">
                                    <i data-lucide="film" style="width: 16px; margin-right: 8px;"></i>
                                    <span id="cap-video-filename" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 250px;">Choose video file...</span>
                                </button>
                            </div>
                            <div>
                                <label class="demo-input-label" style="margin-bottom: 4px; display: block;">Select Subtitle File (.srt)</label>
                                <input type="file" id="cap-srt-upload" accept=".srt" style="display: none;">
                                <button class="demo-btn demo-btn-secondary" id="cap-srt-upload-btn" style="width: 100%; justify-content: flex-start; text-align: left;">
                                    <i data-lucide="file-text" style="width: 16px; margin-right: 8px;"></i>
                                    <span id="cap-srt-filename" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 250px;">Choose SRT file...</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="rules-container" style="padding: 1rem; gap:0.75rem;">
                        <h4 style="font-size: 0.9rem; font-weight: 700; border-bottom: 1px solid var(--border-color); padding-bottom: 0.25rem; margin-bottom: 0.25rem;">
                            <i data-lucide="palette" style="width: 16px; display:inline-block; vertical-align:middle; margin-right: 4px;"></i> Caption Style Designer
                        </h4>
                        
                        <div class="rename-rule-group">
                            <div class="demo-input-group">
                                <label class="demo-input-label">Font Size (px)</label>
                                <input type="range" min="16" max="44" value="26" id="cap-size" style="accent-color: var(--primary);">
                            </div>
                            <div class="demo-input-group">
                                <label class="demo-input-label">Text Stroke (px)</label>
                                <input type="range" min="2" max="10" value="4" id="cap-stroke" style="accent-color: var(--primary);">
                            </div>
                        </div>

                        <div class="rename-rule-group">
                            <div class="demo-input-group">
                                <label class="demo-input-label">Base Font Color</label>
                                <input type="color" id="cap-color" value="#ffffff" style="width:100%; height:36px; padding:0; border:none; background:transparent; cursor:pointer;">
                            </div>
                            <div class="demo-input-group">
                                <label class="demo-input-label">Active Word Highlight</label>
                                <input type="color" id="cap-highlight" value="#ef233c" style="width:100%; height:36px; padding:0; border:none; background:transparent; cursor:pointer;">
                            </div>
                        </div>

                        <div class="demo-input-group">
                            <label class="demo-input-label">Vertical Y-Position</label>
                            <input type="range" min="0.4" max="0.85" step="0.05" value="0.65" id="cap-position" style="accent-color: var(--primary);">
                        </div>
                    </div>

                    <div class="demo-btn-group">
                        <button class="demo-btn demo-btn-primary" id="cap-play-btn" style="flex: 1;">
                            <i data-lucide="play"></i> Play Video
                        </button>
                        <button class="demo-btn demo-btn-secondary" id="cap-render-btn">
                            <i data-lucide="terminal"></i> Merge Subtitles
                        </button>
                    </div>

                    <div id="cap-render-result" style="display:none; text-align:center; padding:0.75rem; border: 1px solid var(--border-color); border-radius: var(--border-radius-sm); background: rgba(0,0,0,0.3);"></div>
                </div>

                <div class="demo-panel-right">
                    <h3 style="font-size:0.95rem; font-weight:600; margin-bottom:0.5rem; display:flex; justify-content:space-between; align-items:center;">
                        <span><i data-lucide="tv" style="color:var(--primary); width:18px; display:inline-block; vertical-align:middle; margin-right:4px;"></i> Subtitled Video Player</span>
                        <span id="cap-timer" style="font-family:monospace; font-size:0.8rem; color:var(--text-muted);">0.0s / 12s</span>
                    </h3>

                    <div class="caption-video-box">
                        <canvas class="caption-video-display" id="cap-video-canvas" width="480" height="270"></canvas>
                        <video class="caption-video-display" id="cap-video-element" style="display: none; object-fit: contain; width: 100%; height: 100%; background: #000;"></video>
                        <div class="caption-overlay-text" id="cap-overlay"></div>
                        <div id="cap-progress-container" style="position:absolute; bottom:0; left:0; width:100%; height:12px; background:transparent; cursor:pointer; display:flex; align-items:flex-end; z-index: 10;">
                            <div style="width:100%; height:4px; background:rgba(255,255,255,0.1); position:relative;">
                                <div style="width:0%; height:100%; background:var(--primary); transition: width 0.1s ease;" id="cap-progress-fill"></div>
                            </div>
                        </div>
                    </div>

                    <h3 style="font-size:0.95rem; font-weight:600; margin-top:1rem; margin-bottom:0.5rem; display:flex; align-items:center;">
                        <i data-lucide="align-left" style="color:var(--secondary); width:18px; display:inline-block; vertical-align:middle; margin-right:4px;"></i> Editable Subtitles (subtitles.srt)
                    </h3>
                    <div class="caption-timeline-editor" id="cap-srt-list"></div>
                </div>
            </div>
        `;
    }

    // ==========================================================================
    // 5. SECURE PASSWORD SUITE DEMO
    // ==========================================================================
    function initPasswordSuite() {
        const lengthInput = document.getElementById('pass-length');
        const lengthVal = document.getElementById('pass-length-val');
        const checkUpper = document.getElementById('pass-upper');
        const checkLower = document.getElementById('pass-lower');
        const checkNumber = document.getElementById('pass-number');
        const checkSpecial = document.getElementById('pass-special');
        const checkExclude = document.getElementById('pass-exclude');

        const displayBox = document.getElementById('pass-display');
        const copyBtn = document.getElementById('pass-copy-btn');
        const generateBtn = document.getElementById('pass-gen-btn');
        const textInput = document.getElementById('pass-input-check');

        const strengthLabel = document.getElementById('strength-label');
        const gaugeFill = document.getElementById('strength-gauge-fill');
        const entropyVal = document.getElementById('entropy-value');
        const crackTimeText = document.getElementById('crack-time');

        // Checklists
        const checkLen = document.getElementById('chk-length');
        const checkUp = document.getElementById('chk-upper');
        const checkLow = document.getElementById('chk-lower');
        const checkNum = document.getElementById('chk-num');
        const checkSpec = document.getElementById('chk-spec');

        const chars = {
            upper: 'ABCDEFGHJKLMNPQRSTUVWXYZ', // excluded similar lookalikes like O, I
            lower: 'abcdefghijkmnopqrstuvwxyz', // excluded l
            number: '23456789', // excluded 0, 1
            special: '!@#$%^&*()_+-=[]{}|;:,.<>?/'
        };

        const charsAll = {
            upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            lower: 'abcdefghijklmnopqrstuvwxyz',
            number: '0123456789',
            special: '!@#$%^&*()_+-=[]{}|;:,.<>?/'
        };

        lengthInput.addEventListener('input', () => {
            lengthVal.textContent = lengthInput.value;
        });

        // Crypto secure random generation
        const generatePassword = () => {
            const length = parseInt(lengthInput.value);
            const pool = checkExclude.checked ? chars : charsAll;

            let charPool = '';
            if (checkUpper.checked) charPool += pool.upper;
            if (checkLower.checked) charPool += pool.lower;
            if (checkNumber.checked) charPool += pool.number;
            if (checkSpecial.checked) charPool += pool.special;

            if (charPool === '') {
                displayBox.textContent = '[Select at least one setting]';
                return;
            }

            let password = '';
            const randomValues = new Uint32Array(length);
            
            // Fallback for secure generation
            if (window.crypto && window.crypto.getRandomValues) {
                window.crypto.getRandomValues(randomValues);
                for (let i = 0; i < length; i++) {
                    password += charPool.charAt(randomValues[i] % charPool.length);
                }
            } else {
                for (let i = 0; i < length; i++) {
                    password += charPool.charAt(Math.floor(Math.random() * charPool.length));
                }
            }

            displayBox.textContent = password;
            textInput.value = password;
            evaluatePassword(password);
        };

        // Shannon Entropy & Crack Estimator
        const evaluatePassword = (pass) => {
            if (!pass) {
                gaugeFill.style.width = '0%';
                strengthLabel.textContent = 'None';
                entropyVal.textContent = '0.0';
                crackTimeText.textContent = 'Instant';
                return;
            }

            const len = pass.length;
            let hasUp = false;
            let hasLow = false;
            let hasNum = false;
            let hasSpec = false;

            // Character pool validation
            for (let i = 0; i < len; i++) {
                const c = pass.charAt(i);
                if (charsAll.upper.includes(c)) hasUp = true;
                else if (charsAll.lower.includes(c)) hasLow = true;
                else if (charsAll.number.includes(c)) hasNum = true;
                else if (charsAll.special.includes(c)) hasSpec = true;
            }

            // Checklist Updates
            const toggleCheck = (el, passed) => {
                if (passed) {
                    el.classList.add('pass');
                    el.querySelector('i').setAttribute('data-lucide', 'check-circle-2');
                } else {
                    el.classList.remove('pass');
                    el.querySelector('i').setAttribute('data-lucide', 'circle');
                }
            };

            toggleCheck(checkLen, len >= 12);
            toggleCheck(checkUp, hasUp);
            toggleCheck(checkLow, hasLow);
            toggleCheck(checkNum, hasNum);
            toggleCheck(checkSpec, hasSpec);
            refreshIcons();

            // Character Set Size (R)
            let R = 0;
            if (hasUp) R += 26;
            if (hasLow) R += 26;
            if (hasNum) R += 10;
            if (hasSpec) R += 32;

            if (R === 0) R = 1;

            // Entropy calculation: H = L * log2(R)
            const entropy = len * Math.log2(R);
            entropyVal.textContent = entropy.toFixed(1);

            // Strength classification
            let strength = '';
            let pct = 0;
            let gaugeClass = '';

            if (entropy < 30) {
                strength = 'Weak (Unsafe)';
                pct = 20;
                gaugeClass = 'strength-weak';
            } else if (entropy < 50) {
                strength = 'Fair';
                pct = 40;
                gaugeClass = 'strength-fair';
            } else if (entropy < 70) {
                strength = 'Good';
                pct = 60;
                gaugeClass = 'strength-good';
            } else if (entropy < 90) {
                strength = 'Strong';
                pct = 80;
                gaugeClass = 'strength-strong';
            } else {
                strength = 'Secure (Highly Protected)';
                pct = 100;
                gaugeClass = 'strength-secure';
            }

            strengthLabel.textContent = strength;
            gaugeFill.className = 'strength-gauge-fill ' + gaugeClass;
            gaugeFill.style.width = `${pct}%`;

            // Crack-time evaluation
            // Guess rate: 10 billion guesses/second (Standard GPU rig offline brute force)
            const guesses = Math.pow(R, len);
            const secondsToCrack = guesses / (10 * 1000 * 1000 * 1000);

            let crackTime = '';
            if (secondsToCrack < 1) {
                crackTime = 'Instant (< 1 second)';
            } else if (secondsToCrack < 60) {
                crackTime = `${secondsToCrack.toFixed(0)} Seconds`;
            } else if (secondsToCrack < 3600) {
                crackTime = `${(secondsToCrack / 60).toFixed(0)} Minutes`;
            } else if (secondsToCrack < 86400) {
                crackTime = `${(secondsToCrack / 3600).toFixed(0)} Hours`;
            } else if (secondsToCrack < 31536000) {
                crackTime = `${(secondsToCrack / 86400).toFixed(0)} Days`;
            } else if (secondsToCrack < 31536000 * 1000) {
                crackTime = `${(secondsToCrack / 31536000).toFixed(0)} Years`;
            } else {
                crackTime = `${(secondsToCrack / (31536000 * 1000)).toFixed(0)} Thousand Years`;
            }
            crackTimeText.textContent = crackTime;
        };

        generateBtn.addEventListener('click', generatePassword);
        
        textInput.addEventListener('input', () => {
            evaluatePassword(textInput.value);
        });

        // Copy button
        copyBtn.addEventListener('click', () => {
            const pass = displayBox.textContent;
            if (pass.startsWith('[Select')) return;
            navigator.clipboard.writeText(pass).then(() => {
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = '<i data-lucide="check"></i> Copied!';
                refreshIcons();
                setTimeout(() => {
                    copyBtn.innerHTML = originalText;
                    refreshIcons();
                }, 1500);
            });
        });

        // Initial Generation
        generatePassword();
    }

    function getPasswordSuiteTemplate() {
        return `
            <div class="demo-grid-2">
                <div class="demo-panel-left">
                    <div class="news-header-box" style="background: rgba(157, 78, 221, 0.05); border-color: rgba(157, 78, 221, 0.15);">
                        <p style="margin:0; font-size:0.9rem; line-height: 1.4;">
                            Replicates the <strong>Python Password Security</strong> suite. Uses secure browser entropy arrays to generate credentials, and evaluates complexity against <strong>Shannon Entropy equations</strong>.
                        </p>
                    </div>

                    <div class="demo-input-group">
                        <label class="demo-input-label">Generated Password</label>
                        <div class="password-box-wrap">
                            <div class="generated-password-display" id="pass-display">[Password]</div>
                            <button class="demo-btn demo-btn-primary" id="pass-copy-btn" title="Copy to Clipboard">
                                <i data-lucide="copy"></i> Copy
                            </button>
                        </div>
                    </div>

                    <div class="demo-input-group">
                        <label class="demo-input-label">
                            <span>Password Length</span>
                            <span id="pass-length-val" style="font-weight:bold; color:var(--primary);">16</span>
                        </label>
                        <input type="range" min="6" max="40" value="16" id="pass-length" style="accent-color: var(--primary);">
                    </div>

                    <div class="password-options-grid">
                        <label class="demo-checkbox-label">
                            <input type="checkbox" id="pass-upper" checked> Include Uppercase
                        </label>
                        <label class="demo-checkbox-label">
                            <input type="checkbox" id="pass-lower" checked> Include Lowercase
                        </label>
                        <label class="demo-checkbox-label">
                            <input type="checkbox" id="pass-number" checked> Include Numbers
                        </label>
                        <label class="demo-checkbox-label">
                            <input type="checkbox" id="pass-special" checked> Include Symbols
                        </label>
                        <label class="demo-checkbox-label" style="grid-column: 1/-1;">
                            <input type="checkbox" id="pass-exclude" checked> Exclude Similar Lookalikes (O, 0, I, l, 1)
                        </label>
                    </div>

                    <button class="demo-btn demo-btn-primary" id="pass-gen-btn" style="width: 100%;">
                        <i data-lucide="key-round"></i> Generate Secure Password
                    </button>
                </div>

                <div class="demo-panel-right">
                    <h3 style="font-size:1rem; font-weight:600; margin-bottom:0.5rem; display:flex; gap:0.5rem; align-items:center;">
                        <i data-lucide="shield-check" style="color:var(--primary); width:18px;"></i> Strength Analyzer Matrix
                    </h3>

                    <div class="demo-input-group">
                        <label class="demo-input-label">Custom Test Password</label>
                        <input type="text" class="demo-input-text" id="pass-input-check" placeholder="Type password to evaluate...">
                    </div>

                    <div class="strength-gauge-box" style="margin-top:0.5rem;">
                        <div style="display:flex; justify-content:space-between; font-size:0.85rem;">
                            <span style="color:var(--text-muted);">Overall Strength:</span>
                            <span class="strength-label" id="strength-label">Secure</span>
                        </div>
                        <div class="strength-gauge-bar">
                            <div class="strength-gauge-fill strength-secure" id="strength-gauge-fill" style="width: 100%;"></div>
                        </div>
                    </div>

                    <div class="entropy-readout">
                        <div>
                            <span style="display:block; font-size:0.8rem; color:var(--text-muted);">Shannon Entropy</span>
                            <span style="font-size:0.7rem; color:var(--text-muted);">(H = L * log2(R))</span>
                        </div>
                        <span class="entropy-value" id="entropy-value">80.0</span>
                    </div>

                    <div style="display:flex; justify-content:space-between; margin-top:0.5rem; font-size:0.85rem; border-bottom:1px solid var(--border-color); padding-bottom:0.5rem;">
                        <span style="color:var(--text-muted);">Est. GPU Brute-Force Crack Time:</span>
                        <span id="crack-time" style="font-weight:bold; color:var(--text-primary);">Centuries</span>
                    </div>

                    <div style="display:flex; flex-direction:column; gap:0.4rem; margin-top:0.5rem;">
                        <div class="checklist-item" id="chk-length"><i data-lucide="circle"></i> At least 12 characters</div>
                        <div class="checklist-item" id="chk-upper"><i data-lucide="circle"></i> Contains uppercase letters</div>
                        <div class="checklist-item" id="chk-lower"><i data-lucide="circle"></i> Contains lowercase letters</div>
                        <div class="checklist-item" id="chk-num"><i data-lucide="circle"></i> Contains digits</div>
                        <div class="checklist-item" id="chk-spec"><i data-lucide="circle"></i> Contains special symbols</div>
                    </div>
                </div>
            </div>
        `;
    }

    // --- Start triggers on load ---
    bindTriggers();
});
