import { useProgress } from "@react-three/drei";
// import { Joystick } from "ecctrl/input";
import MiniMap from "../MiniMap/MiniMap";
import { useEffect, useState, useRef } from "react";
import { useLinkStore } from "../../stores/linkStore";
import PortfolioItem from "../PortfolioItem/PortfolioItem";
// import { useInputStore } from "../../stores/inputState";
import { setMuted } from "../../utils/sounds";

export default function UI() {

  // const pressJump = useInputStore(
  //   state => state.pressJump
  // );

  const [isMuted, setIsMuted] = useState(false)

  // const releaseJump = useInputStore(
  //   state => state.releaseJump
  // )

  const { progress } = useProgress();
  const isTouchDevice = navigator.maxTouchPoints > 0;

  // Keep track of the touch lifecycle
  const pendingTouchRef = useRef<TouchEvent | null>(null);
  const isForwardingRef = useRef(false);
  const touchIdRef = useRef<number | null>(null);

  // 1. Listen globally to intercept the whole touch gesture
  useEffect(() => {
    if (!isTouchDevice) return;

    const getJoystickInner = () => {
      const wrapper = document.querySelector("#ecctrl-joystick-wrapper") as HTMLElement;
      return wrapper ? (wrapper.querySelector("#ecctrl-joystick") as HTMLElement) || wrapper : null;
    };


    const handleTouchStart = (event: TouchEvent) => {

      const target = event.target as HTMLElement;


      // ignore joystick itself
      if (target.closest("#ecctrl-joystick-wrapper")) {
        return;
      }


      // ignore jump button
      if (target.closest("#jump-button")) {
        return;
      }


      const touch = event.touches[0];

      isForwardingRef.current = true;
      touchIdRef.current = touch.identifier;
      pendingTouchRef.current = event;

    };

    const handleTouchMove = (event: TouchEvent) => {
      if (!isForwardingRef.current) return;

      // Stop camera rotation / background scrolling while dragging joystick
      if (event.cancelable) {
        event.preventDefault();
      }
      event.stopPropagation();

      // Find our original touch and forward it to the joystick as a pointermove
      const touch = Array.from(event.touches).find(t => t.identifier === touchIdRef.current) || event.touches[0];
      const innerJoystick = getJoystickInner();

      if (innerJoystick && touch) {
        innerJoystick.dispatchEvent(new PointerEvent("pointermove", {
          bubbles: true, cancelable: true,
          clientX: touch.clientX, clientY: touch.clientY,
          pointerId: touch.identifier || 1, pointerType: "touch", isPrimary: true
        }));
      }
    };

    const handleTouchEnd = (event: TouchEvent) => {
      if (!isForwardingRef.current) return;

      // touchend events store the lifted finger in changedTouches
      const touch = Array.from(event.changedTouches).find(t => t.identifier === touchIdRef.current) || event.changedTouches[0];
      const innerJoystick = getJoystickInner();

      if (innerJoystick && touch) {
        innerJoystick.dispatchEvent(new PointerEvent("pointerup", {
          bubbles: true, cancelable: true,
          clientX: touch.clientX, clientY: touch.clientY,
          pointerId: touch.identifier || 1, pointerType: "touch", isPrimary: true
        }));
      }

      // Reset state so we stop forwarding
      isForwardingRef.current = false;
      touchIdRef.current = null;
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("touchcancel", handleTouchEnd);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [isTouchDevice]);

  const [activeKeys, setActiveKeys] = useState({
    w: false,
    a: false,
    s: false,
    d: false,
    c: false,
    space: false,
  });

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      setActiveKeys(prev => ({
        ...prev,
        [e.key.toLowerCase()]: true,
        ...(e.key === " " && { space: true }),
      }));
    };

    const up = (e: KeyboardEvent) => {
      setActiveKeys(prev => ({
        ...prev,
        [e.key.toLowerCase()]: false,
        ...(e.key === " " && { space: false }),
      }));
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);

    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

    const activeZone = useLinkStore(
      state => state.activeZone
    ) || {
      name: ' ',
      url: '',

    } ;

  if (progress < 100) return null;

  const toggleMute = () => {
    setIsMuted(!isMuted)
    setMuted(!isMuted)
  }

  return (
    <>
      <button className="mute-btn" onClick={toggleMute}>
        {
          isMuted
          ?
          <span>&#128263;</span>
          :
          <span>&#128266;</span>
        }
      </button>
      {!isTouchDevice && (
        <div className="controls">
          <div className="arrows">
            <span className={`arrow ${activeKeys.w ? 'arrow--active' : ''} arrow--up`}>W</span>
            <span className={`arrow ${activeKeys.a ? 'arrow--active' : ''} arrow--left`}>A</span>
            <span className={`arrow ${activeKeys.s ? 'arrow--active' : ''} arrow--down`}>S</span>
            <span className={`arrow ${activeKeys.d ? 'arrow--active' : ''} arrow--right`}>D</span>
          </div>

          <span className={`arrow ${activeKeys.c ? 'arrow--active' : ''} arrow--shift`}>
            <span>FREE CAMERA  C</span>
          </span>

          <span className={`arrow ${activeKeys.space ? 'arrow--active' : ''} arrow--shift`}>
            <span>JUMP SPACE</span>
          </span>
        </div>
      )}

      {!isTouchDevice && <MiniMap />}
{/*
      {isTouchDevice && (
        <div
          id="ecctrl-joystick-wrapper"
          style={{
            position: "fixed",
            left: 0,
            top: window.innerHeight - 200,
            zIndex: 10,
            pointerEvents: "auto",
            touchAction: "none"
          }}
        >
          <Joystick />
        </div>
      )}


      {isTouchDevice && (
        <button
          id="jump-button"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: "fixed",
            right: 40,
            bottom: 40,
            width: 60,
            height: 60,
            padding: 0,
            border: 'none',
            userSelect: 'none',
            backgroundColor: 'transparent',
            zIndex: 20,
            fontSize: 60
          }}
          onPointerDown={pressJump}
          onPointerUp={releaseJump}
          onPointerLeave={releaseJump}
        >
          ⬆️
        </button>
      )} */}

      {
        // !isTouchDevice
        // &&
        <PortfolioItem
          visible={activeZone.name.length > 1}
          name={activeZone.name || ' '}
          url={activeZone.url || ''}
          image={activeZone.name}
        />
      }
    </>
  );
}
