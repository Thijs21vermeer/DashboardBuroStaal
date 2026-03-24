"use client";
import React from "react";
import Block from "./_Builtin/Block";
import DropdownLink from "./_Builtin/DropdownLink";
import DropdownList from "./_Builtin/DropdownList";
import DropdownToggle from "./_Builtin/DropdownToggle";
import DropdownWrapper from "./_Builtin/DropdownWrapper";
import Icon from "./_Builtin/Icon";
import Link from "./_Builtin/Link";
import NavbarButton from "./_Builtin/NavbarButton";
import NavbarLink from "./_Builtin/NavbarLink";
import NavbarMenu from "./_Builtin/NavbarMenu";
import NavbarWrapper from "./_Builtin/NavbarWrapper";

export function Navigation(
    {
        as: _Component = NavbarWrapper
    }
) {
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
                    className="logo"
                    options={{
                        href: "#"
                    }} /><NavbarMenu className="nav-menu-2" role="navigation" tag="nav"><DropdownWrapper delay={0} hover={true} tag="div"><DropdownToggle className="dropdown-button dropdown" tag="div"><Icon
                                className="icon-3"
                                widget={{
                                    type: "icon",
                                    icon: "dropdown-toggle"
                                }} /><Block className="text-block-13 _1" tag="div">{"De Ambivent Groep"}</Block></DropdownToggle><DropdownList className="dropdown-list-3" tag="nav"><DropdownLink
                                className="dropdown-2"
                                options={{
                                    href: "#"
                                }}>{"Events"}</DropdownLink><DropdownLink
                                className="dropdown-2"
                                options={{
                                    href: "#"
                                }}>{"Referenties"}</DropdownLink><DropdownLink
                                className="dropdown-2 onderste-button"
                                options={{
                                    href: "#"
                                }}>{"Nieuws"}</DropdownLink></DropdownList></DropdownWrapper><DropdownWrapper delay={0} hover={true} tag="div"><DropdownToggle className="dropdown-button dropdown _2" tag="div"><Icon
                                className="icon-7"
                                widget={{
                                    type: "icon",
                                    icon: "dropdown-toggle"
                                }} /><Block className="        text-block-13" tag="div">{"Locaties"}</Block></DropdownToggle><DropdownList className="dropdown-list-4" tag="nav"><DropdownLink
                                className="dropdown-link-4"
                                options={{
                                    href: "#"
                                }}>{"'t Centrum"}</DropdownLink><DropdownLink
                                className="dropdown-link-5"
                                options={{
                                    href: "#"
                                }}>{"De Zwethburch"}</DropdownLink></DropdownList></DropdownWrapper><NavbarLink
                        className="nav-link-2"
                        options={{
                            href: "#"
                        }}>{"Offerte"}</NavbarLink><NavbarLink
                        className="nav-link-2"
                        options={{
                            href: "#"
                        }}>{"Contact"}</NavbarLink><Block className="bullet" tag="div" /><Link
                        block=""
                        button={true}
                        className="navigation-button"
                        options={{
                            href: "#",
                            target: "_blank"
                        }}>{"Login"}</Link></NavbarMenu><NavbarButton className="menu-button-2" tag="div"><Icon
                        className="icon-2"
                        widget={{
                            type: "icon",
                            icon: "nav-menu"
                        }} /></NavbarButton></Block></_Component>
    );
}