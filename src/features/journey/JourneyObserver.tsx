"use client";

import { useEffect } from "react";
import { recordJourneyEvent, startJourney } from "./journey-store";

export function JourneyObserver() {
  useEffect(() => {
    startJourney();
    const handleScroll = () => {
      if (window.scrollY >= 160) recordJourneyEvent({ type: "scrolled" });
    };
    const handleClick = (event: MouseEvent) => {
      const origin = event.target;
      if (!(origin instanceof Element)) return;
      const conversion = origin
        .closest<HTMLElement>("[data-journey-conversion]")
        ?.dataset.journeyConversion;
      if (conversion === "resume" || conversion === "contact") {
        recordJourneyEvent({ type: "converted", target: conversion });
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return null;
}
