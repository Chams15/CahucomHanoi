import React, { useState } from "react";
import "./styles.css";

const App = () => {
  const [moveCount, setMoveCount] = useState(0);
  const [dragId, setDragId] = useState();
  const [tiles, setTiles] = useState([
    { id: "Tile-1", column: 1, row: 1, width: 2 },
    { id: "Tile-2", column: 1, row: 2, width: 4 },
    { id: "Tile-3", column: 1, row: 3, width: 6 },
  ]);

  const handleDrag = (ev) => {
    const dragTile = tiles.find((tile) => tile.id === ev.currentTarget.id);
    const topTile = tiles
      .filter((tile) => tile.column === dragTile.column)
      .sort((a, b) => a.width - b.width)[0];

    if (topTile && ev.currentTarget.id === topTile.id) {
      setDragId(ev.currentTarget.id);
    } else {
      ev.preventDefault();
    }
  };

  const handleDrop = (ev) => {
    const dragTile = tiles.find((tile) => tile.id === dragId);
    const dropColumn = parseInt(ev.currentTarget.id, 10);

    const dropColumnTiles = tiles.filter((tile) => tile.column === dropColumn);
    const dropColumnTopTile = dropColumnTiles.sort((a, b) => a.width - b.width)[0];

    if (!dropColumnTopTile || dragTile.width < dropColumnTopTile.width) {
      const newTileState = tiles.map((tile) =>
        tile.id === dragTile.id
          ? { ...tile, column: dropColumn, row: dropColumnTiles.length + 1 }
          : tile
      );
      setTiles(newTileState);
      setMoveCount((prevCount) => prevCount + 1);
    }
  };

  const addDisk = () => {
    const largestWidth = Math.max(...tiles.map((tile) => tile.width), 0);
    const newWidth = largestWidth + 2;
    const newRow = tiles.filter((tile) => tile.column === 1).length + 1;

    const newDisk = {
      id: `Tile-${tiles.length + 1}`,
      column: 1,
      row: newRow,
      width: newWidth,
    };

    setTiles((prevTiles) => [...prevTiles, newDisk]);
  };

  const renderColumn = (columnNumber) => {
    const columnTiles = tiles
      .filter((tile) => tile.column === columnNumber)
      .sort((a, b) => a.width - b.width);

    return (
      <div
        key={columnNumber}
        className="column-container"
        id={columnNumber}
        onDragOver={(ev) => ev.preventDefault()}
        onDrop={handleDrop}
      >
        <div className="center-bar" />
        {columnTiles.map((tile, index) => {
          const tileStyles = {
            width: `${tile.width}em`,
            marginTop: index === 0 ? `calc(80vh - ${columnTiles.length * 40 + 20}px)` : "0",
          };
          return (
            <div
              key={tile.id}
              id={tile.id}
              className="tile"
              draggable
              onDragStart={handleDrag}
              style={tileStyles}
            />
          );
        })}
      </div>
    );
  };

  const winCondition = tiles.every((tile) => tile.column === 3);

  return (
    <>
      <div className="App">
        <button className="add-disk-button" onClick={addDisk}>
          Add Disk
        </button>
        <div className="content">
          {[1, 2, 3].map(renderColumn)}
        </div>
        {winCondition && (
          <div className="win-message">
            You Win!
            <div className="win-subtitle">
              You did it in <span className="win-number">{moveCount}</span> moves
            </div>
          </div>
        )}
        Move count: {moveCount}
      </div>
    </>
  );
};

export default App;
