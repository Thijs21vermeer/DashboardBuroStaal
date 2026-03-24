"use client";
import React from "react";
import BlockContainer from "./_Builtin/BlockContainer";
import Heading from "./_Builtin/Heading";
import Image from "./_Builtin/Image";
import Link from "./_Builtin/Link";
import Paragraph from "./_Builtin/Paragraph";
import Section from "./_Builtin/Section";
import * as _interactions from "./interactions";

const _interactionsData = JSON.parse(
    '{"events":{"e-135":{"id":"e-135","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-136"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"2c35c231-e99b-e028-697a-a389def97e17","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"2c35c231-e99b-e028-697a-a389def97e17","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":500,"direction":"BOTTOM","effectIn":true},"createdOn":1728327677786},"e-137":{"id":"e-137","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-138"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"2c35c231-e99b-e028-697a-a389def97e21","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"2c35c231-e99b-e028-697a-a389def97e21","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":1000,"direction":"BOTTOM","effectIn":true},"createdOn":1728327702554},"e-139":{"id":"e-139","name":"","animationType":"preset","eventTypeId":"SCROLL_INTO_VIEW","action":{"id":"","actionTypeId":"SLIDE_EFFECT","instant":false,"config":{"actionListId":"slideInBottom","autoStopEventId":"e-140"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"2c35c231-e99b-e028-697a-a389def97e29","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"2c35c231-e99b-e028-697a-a389def97e29","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":0,"scrollOffsetUnit":"%","delay":1500,"direction":"BOTTOM","effectIn":true},"createdOn":1728327715542},"e-225":{"id":"e-225","name":"","animationType":"custom","eventTypeId":"MOUSE_OVER","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-56","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-226"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"642c7738f0b9eb290ad18a58|e3228b34-1b50-2d25-7ea6-726bca852ad8","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"642c7738f0b9eb290ad18a58|e3228b34-1b50-2d25-7ea6-726bca852ad8","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1728550881378},"e-226":{"id":"e-226","name":"","animationType":"custom","eventTypeId":"MOUSE_OUT","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-58","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-225"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"642c7738f0b9eb290ad18a58|e3228b34-1b50-2d25-7ea6-726bca852ad8","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"642c7738f0b9eb290ad18a58|e3228b34-1b50-2d25-7ea6-726bca852ad8","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1728550881382},"e-227":{"id":"e-227","name":"","animationType":"custom","eventTypeId":"MOUSE_OVER","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-56","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-228"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"642c7738f0b9eb290ad18a58|0055eb2d-6c0e-4529-fcab-b900b68439ec","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"642c7738f0b9eb290ad18a58|0055eb2d-6c0e-4529-fcab-b900b68439ec","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1728552740058},"e-228":{"id":"e-228","name":"","animationType":"custom","eventTypeId":"MOUSE_OUT","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-58","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-227"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"642c7738f0b9eb290ad18a58|0055eb2d-6c0e-4529-fcab-b900b68439ec","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"642c7738f0b9eb290ad18a58|0055eb2d-6c0e-4529-fcab-b900b68439ec","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1728552740060},"e-229":{"id":"e-229","name":"","animationType":"custom","eventTypeId":"MOUSE_OVER","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-56","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-230"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"642c7738f0b9eb290ad18a58|4921b33e-08aa-d25d-c0a8-d4c5cd70223f","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"642c7738f0b9eb290ad18a58|4921b33e-08aa-d25d-c0a8-d4c5cd70223f","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1728552767012},"e-230":{"id":"e-230","name":"","animationType":"custom","eventTypeId":"MOUSE_OUT","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-58","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-229"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"642c7738f0b9eb290ad18a58|4921b33e-08aa-d25d-c0a8-d4c5cd70223f","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"642c7738f0b9eb290ad18a58|4921b33e-08aa-d25d-c0a8-d4c5cd70223f","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1728552767014}},"actionLists":{"a-56":{"id":"a-56","title":"fly in","actionItemGroups":[{"actionItems":[{"id":"a-56-n","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".button-4.home","selectorGuids":["363c0e81-686d-111b-7a9c-f97762cb99af","4733051c-7cfc-cbcc-b7c5-bc04f04847a0"]},"yValue":180,"xUnit":"PX","yUnit":"px","zUnit":"PX"}},{"id":"a-56-n-5","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".heading-56","selectorGuids":["090cd4f9-2a40-8834-0235-ea30109c3305"]},"yValue":41,"xUnit":"PX","yUnit":"px","zUnit":"PX"}},{"id":"a-56-n-2","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"","duration":500,"target":{"useEventTarget":"CHILDREN","selector":".text-block-49","selectorGuids":["27187395-a24b-f8b1-bb8a-3efdc721bae2"]},"yValue":180,"xUnit":"PX","yUnit":"px","zUnit":"PX"}}]},{"actionItems":[{"id":"a-56-n-6","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"easeOut","duration":200,"target":{"useEventTarget":"CHILDREN","selector":".button-4.home","selectorGuids":["363c0e81-686d-111b-7a9c-f97762cb99af","4733051c-7cfc-cbcc-b7c5-bc04f04847a0"]},"yValue":0,"xUnit":"PX","yUnit":"px","zUnit":"PX"}},{"id":"a-56-n-8","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"easeOut","duration":200,"target":{"useEventTarget":"CHILDREN","selector":".text-block-49","selectorGuids":["27187395-a24b-f8b1-bb8a-3efdc721bae2"]},"yValue":0,"xUnit":"PX","yUnit":"px","zUnit":"PX"}},{"id":"a-56-n-7","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"easeOut","duration":200,"target":{"useEventTarget":"CHILDREN","selector":".heading-56","selectorGuids":["090cd4f9-2a40-8834-0235-ea30109c3305"]},"yValue":0,"xUnit":"PX","yUnit":"px","zUnit":"PX"}}]}],"useFirstGroupAsInitialState":true,"createdOn":1728550909218},"a-58":{"id":"a-58","title":"fly out","actionItemGroups":[{"actionItems":[{"id":"a-58-n","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"easeIn","duration":200,"target":{"useEventTarget":"CHILDREN","selector":".button-4.home","selectorGuids":["363c0e81-686d-111b-7a9c-f97762cb99af","4733051c-7cfc-cbcc-b7c5-bc04f04847a0"]},"yValue":180,"xUnit":"PX","yUnit":"px","zUnit":"PX"}},{"id":"a-58-n-3","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"easeIn","duration":200,"target":{"useEventTarget":"CHILDREN","selector":".heading-56","selectorGuids":["090cd4f9-2a40-8834-0235-ea30109c3305"]},"yValue":41,"xUnit":"PX","yUnit":"px","zUnit":"PX"}},{"id":"a-58-n-2","actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"easeIn","duration":200,"target":{"useEventTarget":"CHILDREN","selector":".text-block-49","selectorGuids":["27187395-a24b-f8b1-bb8a-3efdc721bae2"]},"yValue":180,"xUnit":"PX","yUnit":"px","zUnit":"PX"}}]}],"useFirstGroupAsInitialState":false,"createdOn":1728550909218},"slideInBottom":{"id":"slideInBottom","useFirstGroupAsInitialState":true,"actionItemGroups":[{"actionItems":[{"actionTypeId":"STYLE_OPACITY","config":{"delay":0,"duration":0,"target":{"id":"N/A","appliesTo":"TRIGGER_ELEMENT","useEventTarget":true},"value":0}}]},{"actionItems":[{"actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"duration":0,"target":{"id":"N/A","appliesTo":"TRIGGER_ELEMENT","useEventTarget":true},"xValue":0,"yValue":100,"xUnit":"PX","yUnit":"PX","zUnit":"PX"}}]},{"actionItems":[{"actionTypeId":"TRANSFORM_MOVE","config":{"delay":0,"easing":"outQuart","duration":1000,"target":{"id":"N/A","appliesTo":"TRIGGER_ELEMENT","useEventTarget":true},"xValue":0,"yValue":0,"xUnit":"PX","yUnit":"PX","zUnit":"PX"}},{"actionTypeId":"STYLE_OPACITY","config":{"delay":0,"easing":"outQuart","duration":1000,"target":{"id":"N/A","appliesTo":"TRIGGER_ELEMENT","useEventTarget":true},"value":1}}]}]}},"site":{"mediaQueries":[{"key":"main","min":992,"max":10000},{"key":"medium","min":768,"max":991},{"key":"small","min":480,"max":767},{"key":"tiny","min":0,"max":479}]}}'
);

export function UnknownComponent3DeligeHeader(
    {
        as: _Component = Section
    }
) {
    _interactions.useInteractions(_interactionsData);

    return (
        <_Component
            className="section-52"
            grid={{
                type: "section"
            }}
            tag="section"><Section
                className="section-53"
                grid={{
                    type: "section"
                }}
                tag="section"><BlockContainer
                    className="container-69 w-clearfix"
                    data-w-id="2c35c231-e99b-e028-697a-a389def97e17"
                    grid={{
                        type: "container"
                    }}
                    tag="div"><Heading className="heading-46" tag="h1">{"Bruiloften"}</Heading><Image
                        alt=""
                        className="image-15"
                        height="auto"
                        loading="lazy"
                        src="https://cdn.prod.website-files.com/642c7738f0b9eb1000d18a57/66d983f11b48f369ccaccf46_IMG_9297.JPG"
                        width="auto" /><Paragraph className="paragraph-3">{"De Ambivent Groep beheert twee prachtige locaties, gelegen in de Lier (westland), voor uw bruiloftsfeest. Makkelijk bereikbaar en met voldoende parkeergelegenheid."}<br />{"‍"}</Paragraph><Link
                        block=""
                        button={true}
                        className="button-4 home"
                        options={{
                            href: "https://deambiventgroep.webflow.io/bruiloft"
                        }}>{"Meer informatie"}</Link></BlockContainer><BlockContainer
                    className="container-69 w-clearfix"
                    data-w-id="2c35c231-e99b-e028-697a-a389def97e21"
                    grid={{
                        type: "container"
                    }}
                    tag="div"><Heading className="heading-44" tag="h1">{"Feesten & partijen"}</Heading><Image
                        alt=""
                        className="image-16"
                        height="auto"
                        loading="lazy"
                        src="https://cdn.prod.website-files.com/642c7738f0b9eb1000d18a57/66d970bd66e95159f75edbf8_feestavond%20zwethburch.jpeg"
                        width="auto" /><Paragraph className="paragraph-3">{"Heeft u reden voor een feestje? Een verjaardag, pensionering of jubileum? Bij de Ambivent Groep maken wij er samen met u en uw gasten een fantastisch verzorgd feest van."}</Paragraph><Link
                        block=""
                        button={true}
                        className="button-4 home"
                        options={{
                            href: "#"
                        }}>{"Meer informatie"}</Link></BlockContainer><BlockContainer
                    className="container-69 w-clearfix"
                    data-w-id="2c35c231-e99b-e028-697a-a389def97e29"
                    grid={{
                        type: "container"
                    }}
                    tag="div"><Heading className="heading-45" tag="h1">{"Zakelijk"}</Heading><Image
                        alt=""
                        className="image-17"
                        height="auto"
                        loading="lazy"
                        src="https://cdn.prod.website-files.com/642c7738f0b9eb1000d18a57/67042af7b85706bbd9e921f2_IV%20Fotografie-43.jpg"
                        width="auto" /><Paragraph className="paragraph-4">{"Vergadering, bedrijfsuitje, teambuilding? In één onze zalen vindt u alles wat u nodig heeft. Tot maximaal 110 personen."}<br /><br />{"‍"}</Paragraph><Link
                        block=""
                        button={true}
                        className="button-4 home"
                        options={{
                            href: "https://deambiventgroep.webflow.io/zakelijk"
                        }}>{"Meer informatie"}</Link></BlockContainer></Section></_Component>
    );
}