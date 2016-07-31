export default Vue => {
    Vue.mixin({
        methods: {
            $scrollToAnimate(elem, top, left, time) {
                let currentTop = typeof elem.scrollTop !== 'undefined' ? elem.scrollTop : elem.scrollY;
                let currentLeft = typeof elem.scrollLeft !== 'undefined' ? elem.scrollLeft : elem.scrollX;
                let diffTop = top == -1 ? 0 : top - currentTop;
                let diffLeft = left == -1 ? 0 : left - currentLeft;
                let scrollTo = (_top, _left) => {
                    if (typeof elem.scrollTop !== 'undefined') {
                        elem.scrollTop = _top;
                        elem.scrollLeft = _left;
                    } else {
                        elem.scrollTo && elem.scrollTo(_left, _top);
                    }
                };
                let begin = Date.now();
                let animate = () => {
                    let elapsed = Date.now() - begin;
                    let percent = elapsed / time;
                    if(percent > 1.00) {
                        scrollTo(currentTop + diffTop, currentLeft + diffLeft);
                        return;
                    }
                    let moveTop = diffTop * percent;
                    let moveLeft = diffLeft * percent;
                    scrollTo(currentTop + moveTop, currentLeft + moveLeft);
                    requestAnimationFrame(animate);
                };
                animate();
            }
        }
    });
}