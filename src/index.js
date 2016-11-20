import ConnectorLinks from './connector-links';
const rootElm = document.getElementById('root');
const boxes = document.querySelectorAll('.box');
let dragBoxTarget;
let mouseDownEl;
let isDraw = false;
let connectionStates = {};

const Links = new ConnectorLinks(
    document.querySelectorAll('.box .connector'),
    e => {
        mouseDownEl = e;
        isDraw = true;
    });

window.addEventListener('load', () => {
    Links.buildCanvas(rootElm, 'svg-canvas');

    boxes.forEach((item) => {
        item.addEventListener('dragstart', e => {
            dragBoxTarget = e.target;

            const style = window.getComputedStyle(e.target, null);
            e.dataTransfer.setData("text/plain",
                (parseInt(style.getPropertyValue("left"), 10) - e.clientX) + ',' + (parseInt(style.getPropertyValue("top"), 10) - e.clientY)
            );
        });
    });

    document.body.addEventListener('mouseup', e => {
        e.preventDefault();

        if (!mouseDownEl) {
            return;
        }

        const canConnect = mouseDownEl.target.getAttribute('class') === e.target.getAttribute('class');
        const connectionId = mouseDownEl.target.parentNode.getAttribute('data-idx').replace(' ', '-') + mouseDownEl.target.getAttribute('class').replace(' ', '-');

        if (!canConnect) {
            const nodeToRemove = document.getElementById(connectionId);
            nodeToRemove.parentNode.removeChild(nodeToRemove);
        }
        else {
            connectionStates[connectionId] = {
                from: mouseDownEl.target.parentNode.getAttribute('data-idx'),
                to: e.target.parentNode.getAttribute('data-idx')
            };
        }

        mouseDownEl = undefined;
        isDraw = false;
    });

    document.body.addEventListener('mousemove', e => {
        if (!isDraw) {
            return;
        }

        const downX = mouseDownEl.clientX;
        const downY = mouseDownEl.clientY;
        const CORRECT_POSITION = 15;

        Links.addLinkage(document, {
            id: mouseDownEl.target.parentNode.getAttribute('data-idx') + mouseDownEl.target.getAttribute('class').replace(' ', '-'),
            width: '100%',
            height: '100%',
            x0: downX - CORRECT_POSITION,
            y0: downY - CORRECT_POSITION,
            x1: e.clientX - CORRECT_POSITION,
            y1: e.clientY - CORRECT_POSITION,
            z0: (downX > e.clientX ? downX - e.clientX : e.clientX - downX)/2 + (e.clientX < downX ? e.clientX : downX) + 30,
            z1: (downY > e.clientY ? downY - e.clientY : e.clientY - downY)/2 + (e.clientY < downY ? e.clientY : downY) + 30
        });
    });

    rootElm.addEventListener('dragover', e => e.preventDefault());

    rootElm.addEventListener('drop', e => {
        e.preventDefault();

        const offset = e.dataTransfer.getData("text/plain").split(',');
        dragBoxTarget.style.left = (e.clientX + parseInt(offset[0], 10)) + 'px';
        dragBoxTarget.style.top = (e.clientY + parseInt(offset[1], 10)) + 'px';

        Links.updateLinksAfterMove(
            dragBoxTarget.querySelector('.box-inner').getAttribute('data-idx'),
            connectionStates
        );

        dragBoxTarget = undefined;
    });
});
