"use client";
import React from "react";
import Block from "./_Builtin/Block";
import BlockContainer from "./_Builtin/BlockContainer";
import Heading from "./_Builtin/Heading";
import Image from "./_Builtin/Image";
import Link from "./_Builtin/Link";
import Section from "./_Builtin/Section";

export function Footer1(
    {
        as: _Component = Section
    }
) {
    return (
        <_Component
            className="footer"
            grid={{
                type: "section"
            }}
            tag="div"><Block className="container-7 cc-footer" tag="div"><Block className="footer-column cc-footer" tag="div"><Link
                        block="inline"
                        button={false}
                        className="navigation-logo"
                        options={{
                            href: "#"
                        }}><Image
                            alt="Logo van De Ambivent Groep - Evenementen"
                            className="image-9"
                            height="auto"
                            loading="auto"
                            src="https://cdn.prod.website-files.com/642c7738f0b9eb1000d18a57/66d567d919fc19869a5b51dd_DeAmbiventGroep-logo-plat%20RGB.jpg"
                            width="92" /></Link><Block className="text-footer-credits" tag="div">{"© 2025 De Ambivent Groep, Alle rechten voorbehouden."}</Block></Block><BlockContainer
                    className="container-103"
                    grid={{
                        type: "container"
                    }}
                    tag="div"><Heading className="heading-64" tag="h1">{"Bezoekadres:"}</Heading><Block tag="div">{"Hoofdstraat 100, 2678 CM, De Lier"}</Block><Block className=" div-block-58" tag="div" /><Heading className="heading-64" tag="h1">{"Contactgegevens:"}</Heading><Block tag="div">{"Telefoon: 0174 52 86 13"}<br />{"E-mailadres: "}<Link
                            block=""
                            button={false}
                            className=" link-14"
                            options={{
                                href: "mailto:info@deambiventgroep.nl"
                            }}>{"info@deambiventgroep.nl"}</Link></Block></BlockContainer><Block className="footer-column" tag="div"><Block className="footer-links-list" tag="div"><Link
                            block=""
                            button={false}
                            className="link-footer"
                            options={{
                                href: "#"
                            }}>{"Home"}</Link><Link
                            block=""
                            button={false}
                            className="link-footer"
                            options={{
                                href: "#"
                            }}>{"Offerte"}</Link><Link
                            block=""
                            button={false}
                            className="link-footer"
                            options={{
                                href: "#"
                            }}>{"Bruiloften"}</Link><Link
                            block=""
                            button={false}
                            className="link-footer"
                            options={{
                                href: "#",
                                target: "_blank"
                            }}>{"Download Nieuwsbrief"}</Link></Block><Block className="footer-links-list" tag="div"><Link
                            block=""
                            button={false}
                            className="link-footer"
                            options={{
                                href: "#"
                            }}>{"Werken bij"}</Link><Link
                            block=""
                            button={false}
                            className="link-footer"
                            options={{
                                href: "#"
                            }}>{"Over ons"}</Link><Link
                            block=""
                            button={false}
                            className="link-footer"
                            options={{
                                href: "#"
                            }}>{"Contact"}</Link></Block><Block className="footer-links-list" tag="div" /><Block className="footer-social" tag="div"><Link
                            block="inline"
                            button={false}
                            className="link-social"
                            options={{
                                href: "#",
                                target: "_blank"
                            }}><Image
                                alt=""
                                height="auto"
                                loading="auto"
                                src="https://uploads-ssl.webflow.com/6384f34a3ebc934800e9a1d5/6384f34a3ebc9369bfe9a20e_icon-facebook.svg"
                                width="auto" /></Link><Link
                            block="inline"
                            button={false}
                            className="link-social"
                            options={{
                                href: "#",
                                target: "_blank"
                            }}><Image
                                alt=""
                                height="auto"
                                loading="auto"
                                src="https://uploads-ssl.webflow.com/6384f34a3ebc934800e9a1d5/6384f34a3ebc934285e9a20c_icon-instagram.svg"
                                width="auto" /></Link></Block></Block></Block></_Component>
    );
}