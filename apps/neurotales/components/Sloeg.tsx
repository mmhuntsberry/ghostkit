// components/Sloeg.tsx
"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export default function Sloeg() {
  const svgRef = useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const figure = svg.querySelector<SVGGElement>("#figure")!;
    const mouth = svg.querySelector<SVGGraphicsElement>("#mouth")!;
    const leftEye = svg.querySelector<SVGGraphicsElement>("#left-eye")!;
    const rightEye = svg.querySelector<SVGGraphicsElement>("#right-eye")!;

    // 1) Breathing pulse
    gsap.set(figure, {
      transformOrigin: "50% 50%",
      transformBox: "fill-box",
    });
    gsap.to(figure, {
      scale: 1.02,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      duration: 2.5,
    });

    // 2) Mouth slight rotation
    gsap.set(mouth, {
      transformOrigin: "50% 50%",
      transformBox: "fill-box",
    });
    gsap.to(mouth, {
      rotation: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      duration: 1.5,
      delay: 0.5,
    });

    // 3) Blinking eyes every 3 seconds
    [leftEye, rightEye].forEach((eye) =>
      gsap.set(eye, {
        transformOrigin: "50% 50%",
        transformBox: "fill-box",
      })
    );
    const blink = gsap.timeline({ repeat: -1, repeatDelay: 3 });
    blink
      .to([leftEye, rightEye], {
        scaleY: 0,
        duration: 0.1,
        ease: "power1.in",
      })
      .to([leftEye, rightEye], {
        scaleY: 1,
        duration: 0.1,
        ease: "power1.out",
      });
  }, []);

  return (
    <svg
      ref={svgRef}
      width="512"
      height="512"
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id="clip0">
          <rect width="512" height="512" fill="white" />
        </clipPath>
      </defs>

      <g id="figure" clipPath="url(#clip0)">
        <rect width="512" height="512" fill="white" fillOpacity="0.7" />

        <path
          id="outline"
          d="M73 511C73 511 72 438.5 73 418.5C74 398.5 84.3318 353.582 95 313.5C105.511 284.054 115.66 271.444 142 256.5L178.5 235M178.5 235C207.255 222.873 223.348 219.627 252 219.5M178.5 235L163 211.5C151.357 211.88 144.041 211.5 142 203C140.319 196 149.187 190.99 163 188C173.071 189.199 173.993 192.433 170.5 200.99C163.999 202.621 163.293 203.803 163 206M252 219.5C275.395 219.221 288.608 221.208 312.5 232C330.311 241.584 340.111 247.375 353 268C362.657 289.183 366.854 301.141 366.5 323C365.881 349.084 361.677 361.134 346.5 377.5C330.594 386.457 319.036 387.836 293.5 383.5C274.797 377.05 264.291 374.967 245.5 375C228.631 377.958 220.917 383.299 216 411.5C213.68 428.334 212.52 437.616 216 448C217.166 470.854 217.814 486.438 219 499.5L223.5 513M252 219.5L240.5 190.5C233.004 191.366 227.263 192 226 190.5C222.211 186 225.335 179.479 234.5 175C243.956 170.773 254 171 255 174.5C255.194 175.18 255 180.5 254 181.5C253 182.5 243.091 183.829 237.5 186"
          stroke="#121212"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="bevel"
        />

        <path
          id="Vector2"
          d="M380.5 157C375.5 155 378.364 132.897 373 134C367.636 135.103 364.437 134.768 358.5 133C351.349 130.632 347.393 128.971 340.5 125C336.296 122.346 333.829 120.078 329 113C325.148 105.67 323 101 319.5 92C316 83 315.012 82.4978 314.5 75C314.998 70.7802 320 65 322 63C324 61 331 54 336.5 51.5C342 49 348.5 45.5 356.5 45.5C364.5 45.5 375.844 46.4304 388 46C400.302 46.2723 407.079 46.8597 419 48.5C427.082 49.9786 431.231 51.3979 438 55C446.563 60.6268 450.628 63.8617 454.5 70C460.73 77.6512 463.629 81.9735 463 90C464.051 103.933 462.631 110.048 456 117.5C447.84 126.278 434.5 131.5 429 133C423.5 134.5 403 131.5 401 132C399 132.5 385.5 159 380.5 157Z"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
        />

        <path
          id="comment-bubble"
          d="M339 84C339.812 85.3666 329 86.5 331 92C333 97.5 339 97.5 339 97.5C346.423 94.9932 346.649 97.4539 347.5 97.5C348.351 97.5461 345.5 108.5 345.5 108.5C345.5 108.5 342.568 110.294 339 110C336.617 110.476 335.853 109.241 334.5 107"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
        />

        <path
          id="l"
          d="M357 79C356.735 91.8235 363.061 112.027 362 112C360.939 111.973 374.919 107.462 377 108.5"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
        />

        <path
          id="o"
          d="M397.5 100.5C396.314 93.1761 391.5 85.5 391 85.5H388C387.5 85.5 386.5 92 386.5 92C386.5 92 386 99 386.5 101C387 103 389.976 106.002 392 106C395.478 104.359 396.701 103.162 397.5 100.5Z"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
        />

        <path
          id="e"
          d="M402.5 91.5C410.102 91.8379 414.082 91.483 421 90.5C422.318 89.8913 421.311 88.0257 417 82.5C410.589 79.4585 407.845 81.1214 406 82.5C401.112 87.6145 399.172 90.1187 402.5 91.5ZM402.5 91.5C401.967 93.1041 402.12 94.3021 404 97.5C406.986 102.416 408.639 104.441 411.5 105C414.54 105.348 416.243 105.536 419 105C420.735 102.822 421.568 101.606 421.5 99.5"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
        />

        <path
          id="g"
          d="M439 79C430.467 80.4742 427.091 82.0525 426 87.5C425.492 90.3715 425.238 91.985 426 95C428.678 98.534 430.587 99.936 435 101C438.81 101.569 440.669 101.463 442.5 99C443.555 96.2283 443.761 94.6914 443 92C442.063 90.0414 438.652 90.1957 432.5 90.5"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* -- Eyes (for blinking) -- */}
        <path
          id="left-eye"
          d="M230.5 252.5C235.959 256.697 238.938 259.112 243.5 264"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          id="right-eye"
          d="M262.5 262.5C262.849 259.264 264.696 255.471 271.5 244.5"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* -- Mouth (for rotation) -- */}
        <path
          id="mouth"
          d="M317 290C305.946 283.195 301.66 277.393 295.5 265.5C294.386 262.473 294.383 269.825 295 292C294.5 296 298.384 311.562 301 310C307.29 304.514 310.81 299.121 317 290ZM317 290C335.289 299.836 350 301 352.5 301C355 301 350.5 331 345.5 332C340.299 333.659 336.477 330.218 328.5 318.5C322.501 307.927 320.414 301.527 317 290Z"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* ...any other shapes you have...*/}
      </g>
    </svg>
  );
}
