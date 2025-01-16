import React from "react";
/**
 * Gets bounding boxes for an element. This is implemented for you
 */
export function getElementBounds(elem: HTMLElement) {
  const bounds = elem.getBoundingClientRect();
  const top = bounds.top + window.scrollY;
  const left = bounds.left + window.scrollX;

  return {
    x: left,
    y: top,
    top,
    left,
    width: bounds.width,
    height: bounds.height,
  };
}

/**
 * **TBD:** Implement a function that checks if a point is inside an element
 */
export function isPointInsideElement(
  coordinate: { x: number; y: number },
  element: HTMLElement
): boolean {
  const bounds = element.getBoundingClientRect(); 
  return (
    coordinate.x >= bounds.left &&
    coordinate.x <= bounds.right &&
    coordinate.y >= bounds.top &&
    coordinate.y <= bounds.bottom
  );
}


/**
 * **TBD:** Implement a function that returns the height of the first line of text in an element
 * We will later use this to size the HTML element that contains the hover player
 */
export function getLineHeightOfFirstLine(element: HTMLElement): number {
  const computedStyle = window.getComputedStyle(element);
  const lineHeight = computedStyle.lineHeight;

  if (lineHeight === "normal") {
    const fontSize = parseFloat(computedStyle.fontSize);
    return fontSize * 1.5;
  }

  return parseInt(lineHeight, 10);
}


export type HoveredElementInfo = {
  element: HTMLElement;
  top: number;
  left: number;
  heightOfFirstLine: number;
};

/**
 * **TBD:** Implement a React hook to be used to help to render hover player
 * Return the absolute coordinates on where to render the hover player
 * Returns null when there is no active hovered paragraph
 * Note: If using global event listeners, attach them window instead of document to ensure tests pass
 */
export function useHoveredParagraphCoordinate(
  parsedElements: HTMLElement[]
): HoveredElementInfo | null {
  const [hoveredInfo, setHoveredInfo] = React.useState<HoveredElementInfo | null>(null);

  React.useEffect(() => {
    function handleMouseMove(event: MouseEvent) {
      const { clientX, clientY } = event;

      const hoveredElement = parsedElements.find((element) =>
        isPointInsideElement({ x: clientX, y: clientY }, element)
      );

      if (hoveredElement) {
        const bounds = hoveredElement.getBoundingClientRect();
        const lineHeight = getLineHeightOfFirstLine(hoveredElement);

        setHoveredInfo({
          element: hoveredElement,
          top: bounds.top + window.scrollY,
          left: bounds.left + window.scrollX,
          heightOfFirstLine: lineHeight,
        });
      } else {
        setHoveredInfo(null);
      }
    }

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [parsedElements]);

  return hoveredInfo;
}
