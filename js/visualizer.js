/* -------------------------------------------------------------------------- */
/* FREQ/ARCH — Audio-Reactive 3D Background                                   */
/*                                                                            */
/* A Three.js wireframe cube grid. When the synthesis engine is playing, each */
/* cube's height is driven by the real frequency spectrum (radial mapping:    */
/* bass in the center, highs at the edges). When idle, it breathes gently.    */
/* -------------------------------------------------------------------------- */

function initThreeJS() {
    if (typeof THREE === 'undefined') return; // CDN failed — page still works

    const canvas = document.getElementById('bg-canvas');
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;
    camera.position.y = 10;
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const particles = new THREE.Group();
    scene.add(particles);

    const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const material = new THREE.MeshBasicMaterial({ color: 0x00f3ff, wireframe: true, transparent: true, opacity: 0.3 });
    const highlightMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: true, transparent: true, opacity: 0.6 });

    const gridSize = 20;
    const spacing = 2;
    const cubes = [];
    const center = (gridSize - 1) / 2;
    const maxDist = Math.sqrt(2) * center;

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const useHighlight = Math.random() > 0.9;
            const mesh = new THREE.Mesh(geometry, useHighlight ? highlightMaterial : material);

            mesh.position.x = (i - gridSize / 2) * spacing;
            mesh.position.z = (j - gridSize / 2) * spacing;
            mesh.position.y = 0;

            // Radial frequency mapping: center cubes react to bass,
            // edge cubes react to highs.
            const dist = Math.sqrt(Math.pow(i - center, 2) + Math.pow(j - center, 2));
            mesh.userData = {
                phaseX: i * 0.2,
                phaseZ: j * 0.2,
                bin: 2 + Math.floor((dist / maxDist) * 70)
            };

            cubes.push(mesh);
            particles.add(mesh);
        }
    }

    // Mouse parallax
    let targetRotationX = 0;
    let targetRotationY = 0;

    document.addEventListener('mousemove', (event) => {
        const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        targetRotationY = mouseX * 0.2;
        targetRotationX = -mouseY * 0.1;
    });

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const time = clock.getElapsedTime();

        particles.rotation.y += (targetRotationY - particles.rotation.y) * 0.05;
        particles.rotation.x += (targetRotationX - particles.rotation.x) * 0.05;

        const playing = typeof AudioEngine !== 'undefined' && AudioEngine.isPlaying();
        const spectrum = playing ? AudioEngine.getSpectrum() : null;

        cubes.forEach(cube => {
            let targetY;
            if (spectrum) {
                // Real audio data drives the grid
                const v = spectrum[cube.userData.bin] / 255;
                targetY = v * v * 9;
            } else {
                // Idle: gentle breathing wave
                targetY = Math.sin(cube.userData.phaseX + time) * Math.cos(cube.userData.phaseZ + time);
            }
            cube.position.y += (targetY - cube.position.y) * 0.35;
            cube.rotation.x = time * 0.5;
            cube.rotation.y = time * 0.5;
        });

        renderer.render(scene, camera);
    }

    animate();
}
