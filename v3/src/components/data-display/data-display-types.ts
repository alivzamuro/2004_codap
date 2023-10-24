import React from "react"
import {DotsElt} from "./d3-types"

export type IDotsRef = React.MutableRefObject<DotsElt>

export interface PlotProps {
  dotsRef: IDotsRef
  enableAnimation: React.MutableRefObject<boolean>
}

export type Point = { x: number, y: number }
export type CPLine = { slope: number, intercept: number, pivot1?: Point, pivot2?: Point }
export const kNullPoint = {x: -999, y: -999}

export interface Rect {
  x: number, y: number, width: number, height: number
}

export interface rTreeRect { x: number, y: number, w: number, h: number }

export interface counterProps {
  counter: number,
  setCounter: React.Dispatch<React.SetStateAction<number>>
}

export const
  transitionDuration = 1000,
  pointRadiusMax = 10,
  pointRadiusMin = 3,
  pointRadiusLogBase = 2.0, // reduce point radius from max by log of (num. cases) base (LogBase).
  pointRadiusSelectionAddend = 1,
  hoverRadiusFactor = 1.5,
  kDataDisplayFont = '12px sans-serif',
  kChoroplethHeight = 16

export const PrimaryAttrRoles = ['x', 'y'] as const
export type PrimaryAttrRole = typeof PrimaryAttrRoles[number]
export const GraphTipAttrRoles =
  [...PrimaryAttrRoles, 'rightNumeric', 'topSplit', 'rightSplit', 'legend', 'caption'] as const
export const GraphAttrRoles = [
  ...GraphTipAttrRoles, 'yPlus'] as const
export type GraphAttrRole = typeof GraphAttrRoles[number]

export const MapAttrRoles = ['lat', 'long', 'polygon'] as const
export type MapAttrRole = typeof MapAttrRoles[number]

export const AttrRoles = [...GraphAttrRoles, ...MapAttrRoles] as const
export type AttrRole = typeof AttrRoles[number]
export const TipAttrRoles = [...GraphTipAttrRoles, ...MapAttrRoles] as const

