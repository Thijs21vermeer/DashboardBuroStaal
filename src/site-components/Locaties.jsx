"use client";
import React from "react";
import Block from "./_Builtin/Block";
import Cell from "./_Builtin/Cell";
import Heading from "./_Builtin/Heading";
import Layout from "./_Builtin/Layout";
import Link from "./_Builtin/Link";
import Strong from "./_Builtin/Strong";

export function Locaties(
    {
        as: _Component = Layout
    }
) {
    return (
        <_Component
            className="quick-stack"
            id="w-node-_4e5badbc-dd3e-1d0a-dd6c-092b47f769e7-47f769e7"><Cell
                className="cell"
                id="w-node-_4e5badbc-dd3e-1d0a-dd6c-092b47f769e8-47f769e7"><Heading className="heading-22" tag="h1">{"Onze"}<Strong className="bold-text-4 evenementen">{"evenementen"}</Strong>{"locaties"}</Heading></Cell><Cell
                className="cell-3"
                id="w-node-_4e5badbc-dd3e-1d0a-dd6c-092b47f769ee-47f769e7"><Block className="div-block-15" tag="div"><Link
                        block=""
                        button={true}
                        className="button-11"
                        options={{
                            href: "https://deambiventgroep.webflow.io/de-zwethburch"
                        }}>{"De Zwethburch"}</Link></Block><Block className="div-block-14" tag="div"><Link
                        block=""
                        button={true}
                        className="button-10"
                        options={{
                            href: "https://deambiventgroep.webflow.io/t-centrum"
                        }}>{"'t Centrum"}</Link></Block></Cell></_Component>
    );
}