"use client";
import React from "react";
import Block from "./_Builtin/Block";
import DropdownLink from "./_Builtin/DropdownLink";
import DropdownList from "./_Builtin/DropdownList";
import DropdownToggle from "./_Builtin/DropdownToggle";
import DropdownWrapper from "./_Builtin/DropdownWrapper";
import Icon from "./_Builtin/Icon";
import Image from "./_Builtin/Image";
import Link from "./_Builtin/Link";
import NavbarButton from "./_Builtin/NavbarButton";
import NavbarLink from "./_Builtin/NavbarLink";
import NavbarMenu from "./_Builtin/NavbarMenu";
import NavbarWrapper from "./_Builtin/NavbarWrapper";
import Section from "./_Builtin/Section";
import * as _interactions from "./interactions";

const _interactionsData = JSON.parse(
    '{"events":{},"actionLists":{},"site":{"mediaQueries":[{"key":"main","min":992,"max":10000},{"key":"medium","min":768,"max":991},{"key":"small","min":480,"max":767},{"key":"tiny","min":0,"max":479}]}}'
);

export function NavigationMetAchtergrond(
    {
        as: _Component = NavbarWrapper
    }
) {
    _interactions.useInteractions(_interactionsData);

    return (
        <_Component
            className="navigation-2"
            config={{
                easing: "ease-out",
                easing2: "ease-out",
                duration: 400,
                docHeight: false,
                noScroll: false,
                animation: "default",
                collapse: "medium"
            }}
            data-animation="default"
            data-collapse="medium"
            data-duration="400"
            data-easing="ease-out"
            data-easing2="ease-out"
            tag="div"><Block className="navigation-container" tag="div"><Link
                    block="inline"
                    button={false}
                    className="logo centrum"
                    options={{
                        href: "#"
                    }}><Image
                        alt="De Ambivent Groep - Evenementen"
                        className="image-6 centrum"
                        data-w-id="3d9982db-0570-c88b-c1ab-52d24664236b"
                        height="auto"
                        loading="auto"
                        src="https://cdn.prod.website-files.com/642c7738f0b9eb1000d18a57/66d566efa81dc3e2c570c4e6_DeAmbiventGroep_Logo-ZonderSlogan-RGB.png"
                        width="321" /></Link><Section
                    className="section-82"
                    grid={{
                        type: "section"
                    }}
                    tag="section"><NavbarMenu className="nav-menu-2 ambivent" role="navigation" tag="nav"><DropdownWrapper className="dropdown-4" delay={0} hover={true} tag="div"><DropdownToggle className="dropdown-button dropdown" tag="div"><Icon
                                    className="icon-3"
                                    widget={{
                                        type: "icon",
                                        icon: "dropdown-toggle"
                                    }} /><Link
                                    block=""
                                    button={true}
                                    className="button-19"
                                    options={{
                                        href: "https://deambiventgroep.webflow.io/"
                                    }}>{"De Ambivent Groep"}</Link></DropdownToggle><DropdownList className="dropdown-list-3" tag="nav"><DropdownLink
                                    className="dropdown-2"
                                    options={{
                                        href: "https://deambiventgroep.webflow.io/bruiloft"
                                    }}>{"Bruiloft"}</DropdownLink><DropdownLink
                                    className="dropdown-2 _1"
                                    options={{
                                        href: "https://deambiventgroep.webflow.io/feesten-partijen"
                                    }}>{"Feesten en partijen"}</DropdownLink><DropdownLink
                                    className="dropdown-link-9"
                                    options={{
                                        href: "https://deambiventgroep.webflow.io/zakelijk"
                                    }}>{"Zakelijk"}</DropdownLink><DropdownLink
                                    className="dropdown-2 onderste-button"
                                    options={{
                                        href: "https://deambiventgroep.webflow.io/meest-gestelde-vragen"
                                    }}>{"Meest gestelde vragen"}</DropdownLink></DropdownList></DropdownWrapper><NavbarLink
                            className="nav-link-2"
                            options={{
                                href: "https://deambiventgroep.webflow.io/evenementen"
                            }}>{"Events"}</NavbarLink><NavbarLink
                            className="nav-link-2"
                            options={{
                                href: "https://deambiventgroep.webflow.io/offerte"
                            }}>{"Offerte"}</NavbarLink><DropdownWrapper className="dropdown-5" delay={0} hover={true} tag="div"><DropdownToggle className="dropdown-button dropdown _2" tag="div"><Icon
                                    className="icon-7"
                                    widget={{
                                        type: "icon",
                                        icon: "dropdown-toggle"
                                    }} /><Link
                                    block=""
                                    button={true}
                                    className="button-19 over-ons"
                                    options={{
                                        href: "https://deambiventgroep.webflow.io/over-ons"
                                    }}>{"Over ons"}</Link></DropdownToggle><DropdownList className="dropdown-list-4" tag="nav"><DropdownLink
                                    className="dropdown-link-4 nav-ambivent"
                                    options={{
                                        href: "https://deambiventgroep.webflow.io/sfeerlocaties"
                                    }}>{"Sfeerlocaties"}</DropdownLink><DropdownLink
                                    className="dropdown-link-4 nav-ambivent"
                                    options={{
                                        href: "https://deambiventgroep.webflow.io/werken-bij"
                                    }}>{"Werken bij"}</DropdownLink><DropdownLink
                                    className="dropdown-link-4 nav-ambivent onderste"
                                    options={{
                                        href: "https://deambiventgroep.webflow.io/over-ons"
                                    }}>{"Leer ons kennen"}</DropdownLink></DropdownList></DropdownWrapper><NavbarLink
                            className="nav-link-2"
                            options={{
                                href: "https://deambiventgroep.webflow.io/contact"
                            }}>{"Contact"}</NavbarLink><Block className="bullet" tag="div" /><Link
                            block=""
                            button={true}
                            className="navigation-button"
                            options={{
                                href: "#"
                            }}>{"Login"}</Link></NavbarMenu><NavbarButton className="menu-button-2 ambivent" tag="div"><Icon
                            className="icon-2"
                            widget={{
                                type: "icon",
                                icon: "nav-menu"
                            }} /></NavbarButton></Section></Block></_Component>
    );
}