"use client";
import React from "react";
import * as _Builtin from "./_Builtin";

export function Navigation(
    {
        as: _Component = _Builtin.NavbarWrapper
    }
) {
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
                    className="logo"
                    button={false}
                    block="inline"
                    options={{
                        href: "#"
                    }} /><_Builtin.NavbarMenu className="nav-menu-2" tag="nav" role="navigation"><_Builtin.DropdownWrapper tag="div" delay={0} hover={true}><_Builtin.DropdownToggle className="dropdown-button dropdown" tag="div"><_Builtin.Icon
                                className="icon-3"
                                widget={{
                                    type: "icon",
                                    icon: "dropdown-toggle"
                                }} /><_Builtin.Block className="text-block-13 _1" tag="div">{"De Ambivent Groep"}</_Builtin.Block></_Builtin.DropdownToggle><_Builtin.DropdownList className="dropdown-list-3" tag="nav"><_Builtin.DropdownLink
                                className="dropdown-2"
                                options={{
                                    href: "#"
                                }}>{"Events"}</_Builtin.DropdownLink><_Builtin.DropdownLink
                                className="dropdown-2"
                                options={{
                                    href: "#"
                                }}>{"Referenties"}</_Builtin.DropdownLink><_Builtin.DropdownLink
                                className="dropdown-2 onderste-button"
                                options={{
                                    href: "#"
                                }}>{"Nieuws"}</_Builtin.DropdownLink></_Builtin.DropdownList></_Builtin.DropdownWrapper><_Builtin.DropdownWrapper tag="div" delay={0} hover={true}><_Builtin.DropdownToggle className="dropdown-button dropdown _2" tag="div"><_Builtin.Icon
                                className="icon-7"
                                widget={{
                                    type: "icon",
                                    icon: "dropdown-toggle"
                                }} /><_Builtin.Block className="        text-block-13" tag="div">{"Locaties"}</_Builtin.Block></_Builtin.DropdownToggle><_Builtin.DropdownList className="dropdown-list-4" tag="nav"><_Builtin.DropdownLink
                                className="dropdown-link-4"
                                options={{
                                    href: "#"
                                }}>{"'t Centrum"}</_Builtin.DropdownLink><_Builtin.DropdownLink
                                className="dropdown-link-5"
                                options={{
                                    href: "#"
                                }}>{"De Zwethburch"}</_Builtin.DropdownLink></_Builtin.DropdownList></_Builtin.DropdownWrapper><_Builtin.NavbarLink
                        className="nav-link-2"
                        options={{
                            href: "#"
                        }}>{"Offerte"}</_Builtin.NavbarLink><_Builtin.NavbarLink
                        className="nav-link-2"
                        options={{
                            href: "#"
                        }}>{"Contact"}</_Builtin.NavbarLink><_Builtin.Block className="bullet" tag="div" /><_Builtin.Link
                        className="navigation-button"
                        button={true}
                        block=""
                        options={{
                            href: "#",
                            target: "_blank"
                        }}>{"Login"}</_Builtin.Link></_Builtin.NavbarMenu><_Builtin.NavbarButton className="menu-button-2" tag="div"><_Builtin.Icon
                        className="icon-2"
                        widget={{
                            type: "icon",
                            icon: "nav-menu"
                        }} /></_Builtin.NavbarButton></_Builtin.Block></_Component>
    );
}