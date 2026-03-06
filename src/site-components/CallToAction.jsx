"use client";
import React from "react";
import * as _Builtin from "./_Builtin";

export function CallToAction(
    {
        as: _Component = _Builtin.Section
    }
) {
    return (
        <_Component
            className="section-15"
            grid={{
                type: "section"
            }}
            tag="div"><_Builtin.Heading className="h3-2 cc-cta" tag="h3">{"Online offerte maken"}</_Builtin.Heading><_Builtin.Block className="container-7 cc-cta" tag="div"><_Builtin.Block className="cta-column tekst" tag="div"><_Builtin.Block className="cta-left-top" tag="div" /><_Builtin.Heading className="h2 offerte" tag="h3">{"Binnen 5 minuten een offerte voor uw evenement of bruiloft!"}</_Builtin.Heading></_Builtin.Block><_Builtin.BlockContainer
                    className="container-106"
                    grid={{
                        type: "container"
                    }}
                    tag="div"><_Builtin.DropdownWrapper className="dropdown-8 ambivent" tag="div" delay={0} hover={true}><_Builtin.DropdownToggle className="dropdown-toggle-3 ambivent" tag="div"><_Builtin.Icon
                                className="icon-12"
                                widget={{
                                    type: "icon",
                                    icon: "dropdown-toggle"
                                }} /><_Builtin.Block className="text-block-58" tag="div">{"Offerte"}</_Builtin.Block></_Builtin.DropdownToggle><_Builtin.DropdownList className="dropdown-list-5 ambivent" tag="nav"><_Builtin.DropdownLink
                                className="dropdown-link-11 ambivent"
                                options={{
                                    href: "https://restau.nl/centrum/inloggen"
                                }}>{"Offerte 't Centrum"}</_Builtin.DropdownLink><_Builtin.DropdownLink
                                className="dropdown-link-12 ambivent"
                                options={{
                                    href: "https://restau.nl/zwethburch/inloggen"
                                }}>{"Offerte De Zwethburch"}</_Builtin.DropdownLink></_Builtin.DropdownList></_Builtin.DropdownWrapper></_Builtin.BlockContainer><_Builtin.Block className="cta-column button-tekst" tag="div" /></_Builtin.Block></_Component>
    );
}