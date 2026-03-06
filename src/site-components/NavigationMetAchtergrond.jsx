"use client";
import React from "react";
import * as _Builtin from "./_Builtin";
import * as _interactions from "./interactions";

const _interactionsData = JSON.parse(
    '{"events":{},"actionLists":{},"site":{"mediaQueries":[{"key":"main","min":992,"max":10000},{"key":"medium","min":768,"max":991},{"key":"small","min":480,"max":767},{"key":"tiny","min":0,"max":479}]}}'
);

export function NavigationMetAchtergrond(
    {
        as: _Component = _Builtin.NavbarWrapper
    }
) {
    _interactions.useInteractions(_interactionsData);

    return (
        <_Component
            className="navigation-2"
            tag="div"
            data-collapse="medium"
            data-animation="default"
            data-duration="400"
            data-easing="ease-out"
            data-easing2="ease-out"
            config={{
                easing: "ease-out",
                easing2: "ease-out",
                duration: 400,
                docHeight: false,
                noScroll: false,
                animation: "default",
                collapse: "medium"
            }}><_Builtin.Block className="navigation-container" tag="div"><_Builtin.Link
                    className="logo centrum"
                    button={false}
                    block="inline"
                    options={{
                        href: "#"
                    }}><_Builtin.Image
                        className="image-6 centrum"
                        data-w-id="3d9982db-0570-c88b-c1ab-52d24664236b"
                        width="321"
                        height="auto"
                        loading="auto"
                        alt="De Ambivent Groep - Evenementen"
                        src="https://cdn.prod.website-files.com/642c7738f0b9eb1000d18a57/66d566efa81dc3e2c570c4e6_DeAmbiventGroep_Logo-ZonderSlogan-RGB.png" /></_Builtin.Link><_Builtin.Section
                    className="section-82"
                    grid={{
                        type: "section"
                    }}
                    tag="section"><_Builtin.NavbarMenu className="nav-menu-2 ambivent" tag="nav" role="navigation"><_Builtin.DropdownWrapper className="dropdown-4" tag="div" delay={0} hover={true}><_Builtin.DropdownToggle className="dropdown-button dropdown" tag="div"><_Builtin.Icon
                                    className="icon-3"
                                    widget={{
                                        type: "icon",
                                        icon: "dropdown-toggle"
                                    }} /><_Builtin.Link
                                    className="button-19"
                                    button={true}
                                    block=""
                                    options={{
                                        href: "https://deambiventgroep.webflow.io/"
                                    }}>{"De Ambivent Groep"}</_Builtin.Link></_Builtin.DropdownToggle><_Builtin.DropdownList className="dropdown-list-3" tag="nav"><_Builtin.DropdownLink
                                    className="dropdown-2"
                                    options={{
                                        href: "https://deambiventgroep.webflow.io/bruiloft"
                                    }}>{"Bruiloft"}</_Builtin.DropdownLink><_Builtin.DropdownLink
                                    className="dropdown-2 _1"
                                    options={{
                                        href: "https://deambiventgroep.webflow.io/feesten-partijen"
                                    }}>{"Feesten en partijen"}</_Builtin.DropdownLink><_Builtin.DropdownLink
                                    className="dropdown-link-9"
                                    options={{
                                        href: "https://deambiventgroep.webflow.io/zakelijk"
                                    }}>{"Zakelijk"}</_Builtin.DropdownLink><_Builtin.DropdownLink
                                    className="dropdown-2 onderste-button"
                                    options={{
                                        href: "https://deambiventgroep.webflow.io/meest-gestelde-vragen"
                                    }}>{"Meest gestelde vragen"}</_Builtin.DropdownLink></_Builtin.DropdownList></_Builtin.DropdownWrapper><_Builtin.NavbarLink
                            className="nav-link-2"
                            options={{
                                href: "https://deambiventgroep.webflow.io/evenementen"
                            }}>{"Events"}</_Builtin.NavbarLink><_Builtin.NavbarLink
                            className="nav-link-2"
                            options={{
                                href: "https://deambiventgroep.webflow.io/offerte"
                            }}>{"Offerte"}</_Builtin.NavbarLink><_Builtin.DropdownWrapper className="dropdown-5" tag="div" delay={0} hover={true}><_Builtin.DropdownToggle className="dropdown-button dropdown _2" tag="div"><_Builtin.Icon
                                    className="icon-7"
                                    widget={{
                                        type: "icon",
                                        icon: "dropdown-toggle"
                                    }} /><_Builtin.Link
                                    className="button-19 over-ons"
                                    button={true}
                                    block=""
                                    options={{
                                        href: "https://deambiventgroep.webflow.io/over-ons"
                                    }}>{"Over ons"}</_Builtin.Link></_Builtin.DropdownToggle><_Builtin.DropdownList className="dropdown-list-4" tag="nav"><_Builtin.DropdownLink
                                    className="dropdown-link-4 nav-ambivent"
                                    options={{
                                        href: "https://deambiventgroep.webflow.io/sfeerlocaties"
                                    }}>{"Sfeerlocaties"}</_Builtin.DropdownLink><_Builtin.DropdownLink
                                    className="dropdown-link-4 nav-ambivent"
                                    options={{
                                        href: "https://deambiventgroep.webflow.io/werken-bij"
                                    }}>{"Werken bij"}</_Builtin.DropdownLink><_Builtin.DropdownLink
                                    className="dropdown-link-4 nav-ambivent onderste"
                                    options={{
                                        href: "https://deambiventgroep.webflow.io/over-ons"
                                    }}>{"Leer ons kennen"}</_Builtin.DropdownLink></_Builtin.DropdownList></_Builtin.DropdownWrapper><_Builtin.NavbarLink
                            className="nav-link-2"
                            options={{
                                href: "https://deambiventgroep.webflow.io/contact"
                            }}>{"Contact"}</_Builtin.NavbarLink><_Builtin.Block className="bullet" tag="div" /><_Builtin.Link
                            className="navigation-button"
                            button={true}
                            block=""
                            options={{
                                href: "#"
                            }}>{"Login"}</_Builtin.Link></_Builtin.NavbarMenu><_Builtin.NavbarButton className="menu-button-2 ambivent" tag="div"><_Builtin.Icon
                            className="icon-2"
                            widget={{
                                type: "icon",
                                icon: "nav-menu"
                            }} /></_Builtin.NavbarButton></_Builtin.Section></_Builtin.Block></_Component>
    );
}