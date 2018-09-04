import React, { Component } from 'React';

export default function (InnerComponet) {
    return class WrapComponent extends InnerComponet {
        render() {
            return(
                <section>
                    <InnerComponet />
                </section>
            )
        }
    }
}