import {
    ViewerApp,
    AssetManagerPlugin,
    GBufferPlugin,
    ProgressivePlugin,
    TonemapPlugin,
    SSRPlugin,
    SSAOPlugin,
    BloomPlugin,
    GammaCorrectionPlugin,
    AssetImporter,


} from "webgi";
import "./styles.css";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CSSRulePlugin } from "gsap/CSSRulePlugin";
import Lenis from 'lenis';

// navbar functions

var listItems = document.getElementById("myList");
var barsIcon = document.getElementById("barsIcon");
var closeIcon = document.getElementById("closeIcon");



function barFunction() {
    if (barsIcon) {
        return (
            listItems.classList.remove('hidden'),
            listItems.classList.add('top-16'),
            closeIcon.classList.replace('hidden', 'block'),
            barsIcon.classList.replace('block', 'hidden'));
    }

    else if (barsIcon) {

        barsIcon.style.display = '';
    }
}
function closeFunction() {
    if (closeIcon) {
        return (
            listItems.classList.add('hidden'),
            listItems.classList.remove('top-16'),
            closeIcon.classList.replace('block', 'hidden'),
            barsIcon.classList.replace('hidden', 'block'));
    }
    else if (barsIcon) {
        barsIcon.style.display = "block";
        closeIcon.style.display = "none";
    }
}

// Animation function
gsap.registerPlugin(CSSRulePlugin)
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    gestureOrientation: 'vertical',
    smoothWheel: true,
    touchMultiplier: 2,
    infinite: false,
})

lenis.stop()
function raf(time: number) {
    lenis.raf(time)
    requestAnimationFrame(raf)
}
requestAnimationFrame(raf)
gsap.registerPlugin(ScrollTrigger)
async function setupViewer() {

    // Initialize the viewer
    const viewer = new ViewerApp({
        canvas: document.getElementById('webgi-canvas') as HTMLCanvasElement,

    })
    
    

    const manager = await viewer.addPlugin(AssetManagerPlugin)
    const camera = viewer.scene.activeCamera
    const position = camera.position
    const target = camera.target

    // plugins 
    await viewer.addPlugin(GBufferPlugin)
    await viewer.addPlugin(new ProgressivePlugin(32))
    await viewer.addPlugin(new TonemapPlugin(true))
    await viewer.addPlugin(GammaCorrectionPlugin)
    await viewer.addPlugin(SSRPlugin)
    await viewer.addPlugin(SSAOPlugin)
    await viewer.addPlugin(BloomPlugin)


    //Loader
    const importer = manager.importer as AssetImporter

    importer.addEventListener("onProgress", (ev) => {
        const progressRatio = (ev.loaded / ev.total)
        console.log(progressRatio)
        document.querySelector('.progress')?.setAttribute('style', `transform:scaleX(${progressRatio})`)
    })
    importer.addEventListener("onLoad", (ev) => {
        gsap.to('.loader', {
            x: '100%', duration: 0.8, ease: 'power4.inOut', delay: 1, onComplete: () => {
                document.body.style.overflowY = 'auto'
                lenis.start()
            }
        })
    })


    viewer.renderer.refreshPipeline()

    await manager.addFromPath("./assets/chairAxel.glb")
    viewer.getPlugin(TonemapPlugin)!.config!.clipBackground = true

    viewer.scene.activeCamera.setCameraOptions({ controlsEnabled: false })
    

    function setupScrollanimation() {

        let mm = gsap.matchMedia();
        // mobile and desktop check
        mm.add({
            isMobile: "(max-width:799px)",
            isDesktop:"(min-width:800px)"
        }, (context) => {
            const { isMobile, isDesktop } = context.conditions;
            console.log(context.conditions)

            const canvas = document.getElementById("webgi-canvas");
            const tl = gsap.timeline()
            tl
                .to(canvas, {
                    keyframes: {
                        "50%": { x: isMobile ? 140: 120 },
                        "100%": { y: isMobile?250:280, x:isMobile?170: 150, ease: "none" }
                    },
                    duration: 5,
                    scrollTrigger: {
                        trigger: "#second-section",
                        start: "top +=400",
                        end: "top +=140",
                        scrub: true,
                        immediateRender: false
                    }
                })

                .to(position, {
                    x: 9.13,
                    y: -1.67,
                    z: 5.08,
                    duration: 2,
                    ease: "power1.inOut",
                    scrollTrigger: {
                        trigger: "#second-section",
                        start: "top +=400",
                        end: "top +=140",
                        scrub: true,
                        immediateRender: false
                    },
                    onUpdate
                }, "<+=3")
                .from("#makeover-home", {
                    x: 100,
                    duration: 3,
                    ease: "power1.in",
                   
                    scrollTrigger: {
                        trigger: "#makeover-section",
                        start: "top +=400",
                        end: "top +=140",
                        
                        scrub: true,
                        
                        immediateRender: false
                    },
                    
                })
                .from("#makeover-workspace", {
                    x: 100,
                    duration: 3,
                    ease: "power1.inOut",
                    
                    scrollTrigger: {
                        trigger: "#makeover-section",
                        start: "top +=400",
                        end: "top +=140",
                        
                        scrub: true,
                        immediateRender: false
                    },
                    
                }, "<+=1")
                .from("#makeover-recreation", {
                    x: 100,
                    duration: 3,
                    ease: "power1.in",
                    
                    scrollTrigger: {
                        trigger: "#makeover-section",
                        start: "top +=400",
                        end: "top +=140",
                        
                        scrub: true,
                        immediateRender: false
                    },
                    
                }, "<+=1")
        })
        
    }

    setupScrollanimation()
    // Webgi update
    let needsUpdate = true;
    function onUpdate() {
        needsUpdate = true;
        // viewer.renderer.resetShadows()
        viewer.setDirty()
    }
    viewer.addEventListener('preFrame', () => {
        if (needsUpdate) {
            camera.positionUpdated(true)
            needsUpdate = false
        }
    })


}

setupViewer()
