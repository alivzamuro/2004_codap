import { MosaicTileRow } from "./mosaic-tile-row"

let mockNodeIdCount = -1  // first call is for tile identifier
jest.mock("../../utilities/js-utils", () => ({
  uniqueId: () => `node-${++mockNodeIdCount}`
}))

describe("MosaicTileRow", () => {
  it("can add/remove tiles", () => {
    const row = MosaicTileRow.create()
    expect(row.nodes.size).toBe(0)
    expect(row.tiles.size).toBe(0)
    expect(row.root).toBe("")

    row.insertTile("tile-1")
    expect(row.nodes.size).toBe(0)
    expect(row.tiles.size).toBe(0)
    expect(row.root).toBe("tile-1")
    expect(row.getGrandParentNode("tile-1")?.id).toBeUndefined()

    row.insertTile("tile-2", { splitTileId: "tile-1" })
    expect(row.nodes.size).toBe(1)
    expect(row.tiles.size).toBe(2)
    expect(row.root).toBe("node-1")
    const node1 = row.nodes.get("node-1")
    expect(node1?.first).toBe("tile-1")
    expect(node1?.second).toBe("tile-2")
    expect(row.tiles.get("tile-1")).toBe("node-1")
    expect(row.tiles.get("tile-2")).toBe("node-1")
    expect(row.getGrandParentNode("tile-1")?.id).toBeUndefined()
    expect(row.getGrandParentNode("tile-2")?.id).toBeUndefined()

    // can retrieve the other id from a node
    expect(node1?.otherId("tile-1")).toBe("tile-2")
    expect(node1?.otherId("tile-2")).toBe("tile-1")

    // can set size of split
    expect(node1?.percent).toBe(0.5)
    node1!.setPercent(0.25)
    expect(node1?.percent).toBe(0.25)

    row.insertTile("tile-3", { splitTileId: "tile-2", direction: "column" })
    expect(row.nodes.size).toBe(2)
    expect(row.tiles.size).toBe(3)
    expect(row.root).toBe("node-1")
    expect(node1?.first).toBe("tile-1")
    expect(node1?.second).toBe("node-2")
    const node2 = row.nodes.get("node-2")
    expect(node2?.first).toBe("tile-2")
    expect(node2?.second).toBe("tile-3")
    expect(row.tiles.get("tile-1")).toBe("node-1")
    expect(row.tiles.get("tile-2")).toBe("node-2")
    expect(row.tiles.get("tile-3")).toBe("node-2")
    expect(row.getGrandParentNode("tile-1")?.id).toBeUndefined()
    expect(row.getGrandParentNode("tile-2")?.id).toBe("node-1")
    expect(row.getGrandParentNode("tile-3")?.id).toBe("node-1")

    row.insertTile("tile-4", { splitTileId: "tile-1", direction: "column" })
    expect(row.nodes.size).toBe(3)
    expect(row.tiles.size).toBe(4)
    expect(row.root).toBe("node-1")
    expect(node1?.first).toBe("node-3")
    expect(node1?.second).toBe("node-2")
    expect(node2?.first).toBe("tile-2")
    expect(node2?.second).toBe("tile-3")
    const node3 = row.nodes.get("node-3")
    expect(node3?.first).toBe("tile-1")
    expect(node3?.second).toBe("tile-4")
    expect(row.tiles.get("tile-1")).toBe("node-3")
    expect(row.tiles.get("tile-2")).toBe("node-2")
    expect(row.tiles.get("tile-3")).toBe("node-2")
    expect(row.tiles.get("tile-4")).toBe("node-3")
    expect(row.getGrandParentNode("tile-1")?.id).toBe("node-1")
    expect(row.getGrandParentNode("tile-2")?.id).toBe("node-1")
    expect(row.getGrandParentNode("tile-3")?.id).toBe("node-1")
    expect(row.getGrandParentNode("tile-4")?.id).toBe("node-1")

    row.removeTile("tile-4")
    expect(row.nodes.size).toBe(2)
    expect(row.tiles.size).toBe(3)
    expect(row.root).toBe("node-1")
    expect(node1?.first).toBe("tile-1")
    expect(node1?.second).toBe("node-2")
    expect(node2?.first).toBe("tile-2")
    expect(node2?.second).toBe("tile-3")
    expect(row.tiles.get("tile-1")).toBe("node-1")
    expect(row.tiles.get("tile-2")).toBe("node-2")
    expect(row.tiles.get("tile-3")).toBe("node-2")

    row.removeTile("tile-3")
    expect(row.nodes.size).toBe(1)
    expect(row.tiles.size).toBe(2)
    expect(row.root).toBe("node-1")
    expect(node1?.first).toBe("tile-1")
    expect(node1?.second).toBe("tile-2")
    expect(row.tiles.get("tile-1")).toBe("node-1")
    expect(row.tiles.get("tile-2")).toBe("node-1")

    row.removeTile("tile-2")
    expect(row.nodes.size).toBe(0)
    expect(row.tiles.size).toBe(1)
    expect(row.root).toBe("tile-1")

    row.removeTile("tile-1")
    expect(row.nodes.size).toBe(0)
    expect(row.tiles.size).toBe(0)
    expect(row.root).toBe("")
  })
})
