"use client";
import React from "react";
import Block from "./_Builtin/Block";
import BlockContainer from "./_Builtin/BlockContainer";
import Section from "./_Builtin/Section";
import SliderArrow from "./_Builtin/SliderArrow";
import SliderMask from "./_Builtin/SliderMask";
import SliderNav from "./_Builtin/SliderNav";
import SliderSlide from "./_Builtin/SliderSlide";
import SliderWrapper from "./_Builtin/SliderWrapper";

export function Slideshow(
    {
        as: _Component = Section
    }
) {
    return (
        <_Component
            className="section-41"
            grid={{
                type: "section"
            }}
            tag="section"><BlockContainer
                className="container-56"
                grid={{
                    type: "container"
                }}
                tag="div"><Block className="div-block-41" tag="div"><SliderWrapper
                        animation="fade"
                        autoMax={0}
                        autoplay={false}
                        className="slider-6"
                        delay={4000}
                        disableSwipe={false}
                        duration={500}
                        easing="ease"
                        hideArrows={false}
                        iconArrows={true}
                        infinite={true}
                        navInvert={true}
                        navNumbers={false}
                        navRound={false}
                        navShadow={false}
                        navSpacing={3}><SliderMask className="mask-3"><SliderSlide className="slide-28" tag="div" /><SliderSlide className="slide-29" tag="div" /></SliderMask><SliderArrow dir="left" /><SliderArrow dir="right" /><SliderNav /></SliderWrapper></Block><Block className="div-block-40" tag="div"><SliderWrapper
                        animation="fade"
                        autoMax={0}
                        autoplay={false}
                        className="slider-5"
                        delay={4000}
                        disableSwipe={false}
                        duration={500}
                        easing="ease"
                        hideArrows={false}
                        iconArrows={true}
                        infinite={true}
                        navInvert={true}
                        navNumbers={false}
                        navRound={false}
                        navShadow={false}
                        navSpacing={3}><SliderMask className="mask-6"><SliderSlide className="slide-26" tag="div" /><SliderSlide className="slide-27" tag="div" /></SliderMask><SliderArrow dir="left" /><SliderArrow dir="right" /><SliderNav /></SliderWrapper></Block><Block className="div-block-42" tag="div"><SliderWrapper
                        animation="fade"
                        autoMax={0}
                        autoplay={false}
                        className="slider-4"
                        delay={4000}
                        disableSwipe={false}
                        duration={500}
                        easing="ease"
                        hideArrows={false}
                        iconArrows={true}
                        infinite={true}
                        navInvert={true}
                        navNumbers={false}
                        navRound={false}
                        navShadow={false}
                        navSpacing={3}><SliderMask className="mask-5"><SliderSlide className="slide-25" tag="div" /><SliderSlide className="slide-24" tag="div" /></SliderMask><SliderArrow dir="left" /><SliderArrow dir="right" /><SliderNav /></SliderWrapper></Block><Block className="div-block-43" tag="div"><SliderWrapper
                        animation="fade"
                        autoMax={0}
                        autoplay={false}
                        className="slider-3"
                        delay={4000}
                        disableSwipe={false}
                        duration={500}
                        easing="ease"
                        hideArrows={false}
                        iconArrows={true}
                        infinite={true}
                        navInvert={true}
                        navNumbers={false}
                        navRound={false}
                        navShadow={false}
                        navSpacing={3}><SliderMask className="mask-4"><SliderSlide className="slide-22" tag="div" /><SliderSlide className="slide-23" tag="div" /></SliderMask><SliderArrow dir="left" /><SliderArrow dir="right" /><SliderNav /></SliderWrapper></Block></BlockContainer></_Component>
    );
}