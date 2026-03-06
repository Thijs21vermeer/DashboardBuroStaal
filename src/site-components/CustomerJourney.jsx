"use client";
import React from "react";
import * as _Builtin from "./_Builtin";
import * as _interactions from "./interactions";

const _interactionsData = JSON.parse(
    '{"events":{"e-31":{"id":"e-31","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-32"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"90eba905-ecc4-33af-8f28-ccc779bc4b2e","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"90eba905-ecc4-33af-8f28-ccc779bc4b2e","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":500,"direction":"BOTTOM","effectIn":true},"createdOn":1725456969120},"e-33":{"id":"e-33","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-34"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"90eba905-ecc4-33af-8f28-ccc779bc4b25","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"90eba905-ecc4-33af-8f28-ccc779bc4b25","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":1000,"direction":"BOTTOM","effectIn":true},"createdOn":1725457014030},"e-35":{"id":"e-35","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-36"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"90eba905-ecc4-33af-8f28-ccc779bc4b1f","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"90eba905-ecc4-33af-8f28-ccc779bc4b1f","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":1500,"direction":"BOTTOM","effectIn":true},"createdOn":1725457029588}},"actionLists":{"slideInBottom":{"id":"slideInBottom","useFirstGroupAsInitialState":true,"actionItemGroups":[{"actionItems":[{"actionTypeId":"STYLE_OPACITY","config":{"delay":0,"duration":0,"target":{"id":"N/A","appliesTo":"TRIGGER_ELEMENT","useEventTarget":true},"value":0}}]},{"actionItems":[{"actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"duration":0,"target":{"id":"N/A","appliesTo":"TRIGGER_ELEMENT","useEventTarget":true},"xValue":0,"yValue":100,"xUnit":"PX","yUnit":"PX","zUnit":"PX"}}]},{"actionItems":[{"actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"outQuart","duration":1000,"target":{"id":"N/A","appliesTo":"TRIGGER_ELEMENT","useEventTarget":true},"xValue":0,"yValue":0,"xUnit":"PX","yUnit":"PX","zUnit":"PX"}},{"actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"outQuart","duration":1000,"target":{"id":"N/A","appliesTo":"TRIGGER_ELEMENT","useEventTarget":true},"value":1}}]}]}},"site":{"mediaQueries":[{"key":"main","min":992,"max":10000},{"key":"medium","min":768,"max":991},{"key":"small","min":480,"max":767},{"key":"tiny","min":0,"max":479}]}}'
);

export function CustomerJourney(
    {
        as: _Component = _Builtin.Section
    }
) {
    _interactions.useInteractions(_interactionsData);

    return (
        <_Component
            grid={{
                type: "section"
            }}
            tag="section"><_Builtin.Section
                className="section-21"
                grid={{
                    type: "section"
                }}
                tag="section"><_Builtin.BlockContainer
                    className="container-21"
                    grid={{
                        type: "container"
                    }}
                    tag="div"><_Builtin.Block
                        className="div-block-18"
                        data-w-id="90eba905-ecc4-33af-8f28-ccc779bc4b1f"
                        tag="div"><_Builtin.Heading className="heading-25" tag="h1">{"Kies uit vele mogelijkheden"}</_Builtin.Heading><_Builtin.Block className="text-block-26" tag="div">{"Stel uw dag zorgvuldig samen door te kiezen uit ons uitgebreide assortiment van heerlijke hapjes, verfrissende drankjes en stijlvolle decoratie. Krijg direct een prijsindicatie! "}</_Builtin.Block></_Builtin.Block></_Builtin.BlockContainer><_Builtin.BlockContainer
                    className="container-22"
                    grid={{
                        type: "container"
                    }}
                    tag="div"><_Builtin.Block
                        className="div-block-17"
                        data-w-id="90eba905-ecc4-33af-8f28-ccc779bc4b25"
                        tag="div"><_Builtin.Heading className="heading-23" tag="h1">{"Start een offerte"}</_Builtin.Heading><_Builtin.Block className="text-block-25" tag="div">{"Stel eenvoudig en snel een gedetailleerde "}<_Builtin.Link
                                className="link-9"
                                button={false}
                                block=""
                                options={{
                                    href: "#"
                                }}>{"offerte "}</_Builtin.Link>{"op. Met ons gebruiks-vriendelijke systeem krijgt u de mogelijkheid om al uw wensen overzichtelijk te bekijken entoe te voegen. "}</_Builtin.Block></_Builtin.Block></_Builtin.BlockContainer><_Builtin.BlockContainer
                    className="container-20"
                    grid={{
                        type: "container"
                    }}
                    tag="div"><_Builtin.Block
                        className="div-block-16"
                        data-w-id="90eba905-ecc4-33af-8f28-ccc779bc4b2e"
                        tag="div"><_Builtin.Heading className="heading-24" tag="h1">{"Kies een locatie"}</_Builtin.Heading><_Builtin.Block className="text-block-24" tag="div">{"Maak een keuze uit onze twee unieke locaties: het moderne "}<_Builtin.Link
                                className="link-8"
                                button={false}
                                block=""
                                options={{
                                    href: "#"
                                }}>{"partycentrum"}</_Builtin.Link>{" voor feesten en bij-eenkomsten, en de romantische "}<_Builtin.Link
                                className="link-7"
                                button={false}
                                block=""
                                options={{
                                    href: "#"
                                }}>{"trouwboerderij"}</_Builtin.Link>{" voor een intieme bruiloft."}</_Builtin.Block></_Builtin.Block></_Builtin.BlockContainer></_Builtin.Section></_Component>
    );
}