"use client";
import React from "react";
import Block from "./_Builtin/Block";
import Heading from "./_Builtin/Heading";
import Icon from "./_Builtin/Icon";
import Paragraph from "./_Builtin/Paragraph";
import Section from "./_Builtin/Section";
import SliderArrow from "./_Builtin/SliderArrow";
import SliderMask from "./_Builtin/SliderMask";
import SliderNav from "./_Builtin/SliderNav";
import SliderSlide from "./_Builtin/SliderSlide";
import SliderWrapper from "./_Builtin/SliderWrapper";

export function Referenties(
    {
        as: _Component = Section
    }
) {
    return (
        <_Component
            className="section-94"
            grid={{
                type: "section"
            }}
            tag="section"><Heading className="heading-63" tag="h1">{"Wat onze gasten te zeggen hebben"}</Heading><SliderWrapper
                animation="slide"
                autoMax={0}
                autoplay={true}
                className="slider-9"
                delay={3500}
                disableSwipe={false}
                duration={800}
                easing="ease"
                hideArrows={false}
                iconArrows={true}
                infinite={true}
                navInvert={false}
                navNumbers={false}
                navRound={true}
                navShadow={false}
                navSpacing={3}><SliderMask><SliderSlide tag="div"><Block className="div-block-57" tag="div"><Paragraph className="paragraph-13">{"Wat een geweldige dag hebben we gehad! Prachtige locatie midden in de natuur. Ook was de service perfect, zo was het personeel heel aardig en flexibel. Één woord TOP!"}<br /><br />{"Bert en Laura"}<br />{"Bruiloft - Boerderij De Zwethburch"}</Paragraph></Block></SliderSlide><SliderSlide tag="div"><Block className="div-block-57" tag="div"><Block className="text-block-56" tag="div">{"'We hebben ons 50 Jarig huwelijks feest bij jullie als een succes ervaren, we ontvingen veel positieven reacties voor de locatie bediening en ook het buffet was uitstekend. We zullen het centrum zeker aanbevelen, en willen je bedanken voor de prettige samenwerking.'"}<br /><br />{"Fam. Duindam"}<br />{"Huwelijksfeest - 't Centrum"}</Block></Block></SliderSlide><SliderSlide tag="div"><Block className="div-block-57" tag="div"><Block className="text-block-56" tag="div">{"'Wij hebben echt een top dag gehad, alles is zo goed verlopen. Vanuit alle gasten ook alleen maar positief geluid. We hebben echt heel erg genoten.'"}<br /><br />{"Raymond & Barbara"}<br />{"Bruiloft - De Zwethburch"}</Block></Block></SliderSlide><SliderSlide tag="div"><Block className="div-block-57" tag="div"><Block className="text-block-56" tag="div">{"'Wij hebben een erg fijn feest bij jullie gehad. De bediening heeft goed voor onze gasten gezorgd, iedereen vond het heel gezellig. Bedankt voor alles!'"}<br />{"‍"}<br />{"Leen & Marjanne"}<br />{"Bruiloft - 't Centrum"}</Block></Block></SliderSlide></SliderMask><SliderArrow className="left-arrow-2" dir="left"><Icon
                        className="icon-9"
                        widget={{
                            type: "icon",
                            icon: "slider-left"
                        }} /></SliderArrow><SliderArrow className="right-arrow-2" dir="right"><Icon
                        className="icon-8"
                        widget={{
                            type: "icon",
                            icon: "slider-right"
                        }} /></SliderArrow><SliderNav className="slide-nav-2" /></SliderWrapper></_Component>
    );
}