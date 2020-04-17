Cypress.Commands.add("getCBioIframe", () => {
    return cy.get("iframe").iframe()
});

Cypress.Commands.add("iframe", { prevSubject: "element" }, $iframe => {
    Cypress.log({
        name: "iframe",
        consoleProps() {
            return {
                iframe: $iframe,
            };
        },
    });
    return new Cypress.Promise(resolve => {
        onIframeReady(
            $iframe,
            () => {
                resolve($iframe.contents().find("body"));
            },
            () => {
                $iframe.on("load", () => {
                    resolve($iframe.contents().find("body"));
                });
            }
        );
    });
});

function onIframeReady($iframe, successFn, errorFn) {
    try {
        const iCon = $iframe.first()[0].contentWindow,
            bl = "about:blank",
            compl = "complete";
        const callCallback = () => {
            try {
                const $con = $iframe.contents();
                if ($con.length === 0) {
                    // https://git.io/vV8yU
                    throw new Error("iframe inaccessible");
                }
                successFn($con);
            } catch (e) {
                // accessing contents failed
                errorFn();
            }
        };
        const observeOnload = () => {
            $iframe.on("load.jqueryMark", () => {
                try {
                    const src = $iframe.attr("src").trim(),
                        href = iCon.location.href;
                    if (href !== bl || src === bl || src === "") {
                        $iframe.off("load.jqueryMark");
                        callCallback();
                    }
                } catch (e) {
                    errorFn();
                }
            });
        };
        if (iCon.document.readyState === compl) {
            const src = $iframe.attr("src").trim(),
                href = iCon.location.href;
            if (href === bl && src !== bl && src !== "") {
                observeOnload();
            } else {
                callCallback();
            }
        } else {
            observeOnload();
        }
    } catch (e) {
        // accessing contentWindow failed
        errorFn();
    }
}

Cypress.Commands.add('canvasClick', (element, x,y) => {
    // Why do we use this particular set of options? There are two main drag implementations:
    // - camera rotation (ThreeJS Orbit Controls) => it requires `button: 0` and `clientX/Y` to exist, e.g.:
    //    cy.get('.planet-view .canvas-3d')
    //      .trigger('mousedown', { button: 0, clientX: 700, clientY: 500 })
    //      .trigger('mousemove', { clientX: 800, clientY: 500 })
    //      .trigger('mouseup')
    // - other interactions (force drawing, continent drawing) => it requires `pageX/Y` to exist
    //    cy.get('.planet-view .canvas-3d')
    //      .trigger('mousedown', { pageX: 700, pageY: 500 })
    //      .trigger('mousemove', { pageX: 800, pageY: 500 })
    //      .trigger('mouseup')
    // To avoid two separate implementations, just set both kind of options.
    // const options = positions.map(pos => (
    //   { button: 0, clientX: pos.x, clientY: pos.y, pageX: pos.x, pageY: pos.y }
    // ))
    // options.forEach((opt, idx) => {
    //   cy.get(element).trigger(idx === 0 ? 'mousedown' : 'mousemove', opt)
    //   cy.wait(20)
    // })
    // cy.get(element).trigger('mouseup')
    // cy.wait(20)
    cy.get(element).click(x,y);
  })