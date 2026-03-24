"use client";
import React from "react";
import Block from "./_Builtin/Block";
import BlockContainer from "./_Builtin/BlockContainer";
import DropdownLink from "./_Builtin/DropdownLink";
import DropdownList from "./_Builtin/DropdownList";
import DropdownToggle from "./_Builtin/DropdownToggle";
import DropdownWrapper from "./_Builtin/DropdownWrapper";
import Heading from "./_Builtin/Heading";
import Icon from "./_Builtin/Icon";
import Section from "./_Builtin/Section";

export function CallToAction(
    {
        as: _Component = Section
    }
) {
    return (
        <_Component
            className="section-15"
            grid={{
                type: "section"
            }}
            tag="div"><Heading className="h3-2 cc-cta" tag="h3">{"Online offerte maken"}</Heading><Block className="container-7 cc-cta" tag="div"><Block className="cta-column tekst" tag="div"><Block className="cta-left-top" tag="div" /><Heading className="h2 offerte" tag="h3">{"Binnen 5 minuten een offerte voor uw evenement of bruiloft!"}</Heading></Block><BlockContainer
                    className="container-106"
                    grid={{
                        type: "container"
                    }}
                    tag="div"><DropdownWrapper className="dropdown-8 ambivent" delay={0} hover={true} tag="div"><DropdownToggle className="dropdown-toggle-3 ambivent" tag="div"><Icon
                                className="icon-12"
                                widget={{
                                    type: "icon",
                                    icon: "dropdown-toggle"
                                }} /><Block className="text-block-58" tag="div">{"Offerte"}</Block></DropdownToggle><DropdownList className="dropdown-list-5 ambivent" tag="nav"><DropdownLink
                                className="dropdown-link-11 ambivent"
                                options={{
                                    href: "https://restau.nl/centrum/inloggen"
                                }}>{"Offerte 't Centrum"}</DropdownLink><DropdownLink
                                className="dropdown-link-12 ambivent"
                                options={{
                                    href: "https://restau.nl/zwethburch/inloggen"
                                }}>{"Offerte De Zwethburch"}</DropdownLink></DropdownList></DropdownWrapper></BlockContainer><Block className="cta-column button-tekst" tag="div" /></Block></_Component>
    );
}