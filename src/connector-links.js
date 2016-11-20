import each from 'lodash/each';

class ConnectorLinks {
    constructor(connectors, attachedHandler) {
        connectors.forEach(item => {
            item.addEventListener('mousedown', e => {
                e.preventDefault();
                attachedHandler(e);
            });
        });
    }

    buildCanvas(parentElm, id) {
        this.svgCanvas = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.svgCanvas.setAttribute('id', id);
        this.svgCanvas.setAttribute('width', '100%');
        this.svgCanvas.setAttribute('height', '100%');
        this.svgCanvas.setAttributeNS('http://www.w3.org/2000/xmlns/', 'xmlns:xlink', 'http://www.w3.org/1999/xlink');
        parentElm.appendChild(this.svgCanvas);

        return this.svgCanvas;
    }

    addLinkage(document, options = {}) {
        const linkageNode = document.getElementById(options.id);

        if (linkageNode) {
            linkageNode.setAttributeNS(null, 'd', `M${options.x0},${options.y0} Q${options.z0},${options.z1} ${options.x1},${options.y1}`);
            return;
        }

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttributeNS(null, 'id', options.id);
        path.setAttributeNS(null, 'd', `M${options.x0},${options.y0} Q${options.z0},${options.z1} ${options.x1},${options.y1}`);
        path.setAttributeNS(null, 'stroke', 'black');
        path.setAttributeNS(null, 'stroke-width', 1);
        path.setAttributeNS(null, 'opacity', 1);
        path.setAttributeNS(null, 'fill', 'none');

        this.svgCanvas.appendChild(path);
    }

    updateLinksAfterMove(droppedIdx, connections) {
        each(connections, (item, idx) => {
            const elm = document.getElementById(idx);
            const dAttr = elm.getAttributeNS(null, 'd').split(' ');
            const connectorClass = idx.match(/square|circle|sq-tilted/gi)[0];
            const el = document.querySelector('[data-idx="' + (item.to === droppedIdx ? item.to : item.from) + '"]').parentNode;
            const connectorEl = el.querySelector(`.${connectorClass}`);

            if (item.to === droppedIdx) {
                elm.setAttributeNS(null, 'd', [...dAttr.slice(0, 2), (el.offsetLeft + connectorEl.offsetLeft + 5) + ',' + (el.offsetTop + connectorEl.offsetTop + 5)].join(' '));
            }
            else if (item.from === droppedIdx) {
                elm.setAttributeNS(null, 'd', ['M' + (el.offsetLeft + connectorEl.offsetLeft + 5) + ',' + (el.offsetTop + connectorEl.offsetTop + 5), ...dAttr.slice(1)].join(' '));
            }
        });
    }
}

export default ConnectorLinks;
