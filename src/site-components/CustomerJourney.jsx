"use client";
import React from "react";
import Block from "./_Builtin/Block";
import BlockContainer from "./_Builtin/BlockContainer";
import Heading from "./_Builtin/Heading";
import Link from "./_Builtin/Link";
import Section from "./_Builtin/Section";
import * as _interactions from "./interactions";

const _interactionsData = JSON.parse(
    '{"events":{"e-31":{"id":"e-31","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-32"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"90eba905-ecc4-33af-8f28-ccc779bc4b2e","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"90eba905-ecc4-33af-8f28-ccc779bc4b2e","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":500,"direction":"BOTTOM","effectIn":true},"createdOn":1725456969120},"e-33":{"id":"e-33","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-34"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"90eba905-ecc4-33af-8f28-ccc779bc4b25","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"90eba905-ecc4-33af-8f28-ccc779bc4b25","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":1000,"direction":"BOTTOM","effectIn":true},"createdOn":1725457014030},"e-35":{"id":"e-35","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-36"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"90eba905-ecc4-33af-8f28-ccc779bc4b1f","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"90eba905-ecc4-33af-8f28-ccc779bc4b1f","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":1500,"direction":"BOTTOM","effectIn":true},"createdOn":1725457029588}},"actionLists":{"slideInBottom":{"id":"slideInBottom","useFirstGroupAsInitialState":true,"actionItemGroups":[{"actionItems":[{"actionTypeId":"STYLE_OPACITY","config":{"delay":0,"duration":0,"target":{"id":"N/A","appliesTo":"TRIGGER_ELEMENT","useEventTarget":true},"value":0}}]},{"actionItems":[{"actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"duration":0,"target":{"id":"N/A","appliesTo":"TRIGGER_ELEMENT","useEventTarget":true},"xValue":0,"yValue":100,"xUnit":"PX","yUnit":"PX","zUnit":"PX"}}]},{"actionItems":[{"actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"outQuart","duration":1000,"target":{"id":"N/A","appliesTo":"TRIGGER_ELEMENT","useEventTarget":true},"xValue":0,"yValue":0,"xUnit":"PX","yUnit":"PX","zUnit":"PX"}},{"actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"outQuart","duration":1000,"target":{"id":"N/A","appliesTo":"TRIGGER_ELEMENT","useEventTarget":true},"value":1}}]}]}},"site":{"mediaQueries":[{"key":"main","min":992,"max":10000},{"key":"medium","min":768,"max":991},{"key":"small","min":480,"max":767},{"key":"tiny","min":0,"max":479}]}}'
);

export function CustomerJourney(
    {
        as: _Component = Section
    }
) {
    _interactions.useInteractions(_interactionsData);

    return (
        <_Component
            grid={{
                type: "section"
            }}
            tag="section"><Section
                className="section-21"
                grid={{
                    type: "section"
                }}
                tag="section"><BlockContainer
                    className="container-21"
                    grid={{
                        type: "container"
                    }}
                    tag="div"><Block
                        className="div-block-18"
                        data-w-id="90eba905-ecc4-33af-8f28-ccc779bc4b1f"
                        tag="div"><Heading className="heading-25" tag="h1">{"Kies uit vele mogelijkheden"}</Heading><Block className="text-block-26" tag="div">{"Stel uw dag zorgvuldig samen door te kiezen uit ons uitgebreide assortiment van heerlijke hapjes, verfrissende drankjes en stijlvolle decoratie. Krijg direct een prijsindicatie! "}</Block></Block></BlockContainer><BlockContainer
                    className="container-22"
                    grid={{
                        type: "container"
                    }}
                    tag="div"><Block
                        className="div-block-17"
                        data-w-id="90eba905-ecc4-33af-8f28-ccc779bc4b25"
                        tag="div"><Heading className="heading-23" tag="h1">{"Start een offerte"}</Heading><Block className="text-block-25" tag="div">{"Stel eenvoudig en snel een gedetailleerde "}<Link
                                block=""
                                button={false}
                                className="link-9"
                                options={{
                                    href: "#"
                                }}>{"offerte "}</Link>{"op. Met ons gebruiks-vriendelijke systeem krijgt u de mogelijkheid om al uw wensen overzichtelijk te bekijken entoe te voegen. "}</Block></Block></BlockContainer><BlockContainer
                    className="container-20"
                    grid={{
                        type: "container"
                    }}
                    tag="div"><Block
                        className="div-block-16"
                        data-w-id="90eba905-ecc4-33af-8f28-ccc779bc4b2e"
                        tag="div"><Heading className="heading-24" tag="h1">{"Kies een locatie"}</Heading><Block className="text-block-24" tag="div">{"Maak een keuze uit onze twee unieke locaties: het moderne "}<Link
                                block=""
                                button={false}
                                className="link-8"
                                options={{
                                    href: "#"
                                }}>{"partycentrum"}</Link>{" voor feesten en bij-eenkomsten, en de romantische "}<Link
                                block=""
                                button={false}
                                className="link-7"
                                options={{
                                    href: "#"
                                }}>{"trouwboerderij"}</Link>{" voor een intieme bruiloft."}</Block></Block></BlockContainer></Section></_Component>
    );
}