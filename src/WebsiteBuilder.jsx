import React, { useState, useRef } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Draggable from "react-draggable";

const TYPE = "component";

const DraggableItem = ({ name }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: TYPE,
    item: { name },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`px-3 py-2 rounded-lg hover:bg-blue-100 hover:text-blue-600 transition-all duration-200 cursor-move text-gray-700 ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      {name}
    </div>
  );
};

const DroppedComponent = ({
  id,
  type,
  value,
  x,
  y,
  styles,
  selected,
  onDelete,
  onSelect,
  onDragStop,
}) => {
  return (
    <Draggable
      bounds="parent"
      defaultPosition={{ x, y }}
      onStop={(e, data) => onDragStop(id, data.x, data.y)}
    >
      <div
        onClick={() => onSelect(id)}
        style={{ ...styles }}
        className={`absolute p-2 border rounded shadow cursor-move bg-white transition-transform duration-200 hover:scale-105 ${
          selected ? "ring-2 ring-blue-400" : ""
        }`}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(id);
          }}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
        >
          ✕
        </button>
        {type === "Pages" && (
          <iframe
            src={value}
            title="Website Preview"
            className="absolute inset-0 w-full h-full border-none"
            style={{
              zIndex: 0,
              pointerEvents: "auto",
            }}
          />
        )}

        {type === "Text" && <div style={styles}>{value}</div>}
        {type === "Image" && (
          <img
            src={value}
            alt="Dropped"
            style={{
              width: styles.width,
              height: styles.height,
              objectFit: "fill", // or 'cover' if you want it to crop instead
              filter: `brightness(${styles.brightness || 1})`,
              borderRadius: styles.borderRadius || "0px",
              display: "block",
              margin: "0 auto",
            }}
            className="rounded shadow"
          />
        )}
        {type === "Button" && (
          <button
            style={styles}
            className="px-4 py-2 rounded text-white transition"
          >
            {value}
          </button>
        )}
      </div>
    </Draggable>
  );
};

const DropZone = ({
  components,
  onDrop,
  onDelete,
  onSelect,
  selectedId,
  onExternalDrop,
  onDragStop,
}) => {
  const dropRef = useRef(null);
  const [{ isOver }, drop] = useDrop(() => ({
    accept: TYPE,
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      const dropRect = dropRef.current.getBoundingClientRect();
      const x = offset.x - dropRect.left;
      const y = offset.y - dropRect.top;
      if (item.name) onDrop(item.name, { x, y });
    },
    collect: (monitor) => ({ isOver: !!monitor.isOver() }),
  }));

  drop(dropRef);

  const handleFileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      const x = e.clientX - dropRef.current.getBoundingClientRect().left;
      const y = e.clientY - dropRef.current.getBoundingClientRect().top;
      onExternalDrop("Image", url, { x, y });
    }
  };

  return (
    <div
      ref={dropRef}
      onDrop={handleFileDrop}
      onDragOver={(e) => e.preventDefault()}
      className={`relative w-full h-full border-0 p-0 bg-white overflow-hidden`}
    >
      {components.length === 0 ? (
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 text-gray-400">
          Website Preview Area
        </span>
      ) : (
        components.map((comp) => (
          <DroppedComponent
            key={comp.id}
            {...comp}
            selected={selectedId === comp.id}
            onDelete={onDelete}
            onSelect={onSelect}
            onDragStop={onDragStop}
          />
        ))
      )}
    </div>
  );
};

export default WebsiteBuilder;

function WebsiteBuilder() {
  const [components, setComponents] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [pendingStyles, setPendingStyles] = useState({});
  let styles = {};

  const handleDrop = (type, position) => {
    const id = Date.now();
    let value = "";

    if (type === "Text") value = "Text";
    else if (type === "Image") value = "https://placehold.co/300x200";
    else if (type === "Button") value = "Click Me";
    else if (type === "Pages") {
      value = "https://example.com";
      styles = { width: "100%", height: "100%", borderRadius: "0px" };
    }

    const newComponent = {
      id,
      type,
      value,
      x: position.x,
      y: position.y,
      styles: {},
    };

    setComponents((prev) => [...prev, newComponent]);
    setSelectedId(id);
    setPendingStyles({});
  };

  const handleExternalDrop = (type, value, position) => {
    const id = Date.now();
    const newComponent = {
      id,
      type,
      value,
      x: position.x,
      y: position.y,
      styles: {},
    };
    setComponents((prev) => [...prev, newComponent]);
    setSelectedId(id);
    setPendingStyles({});
  };

  const handleDelete = (id) => {
    setComponents((prev) => prev.filter((item) => item.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const onDragStop = (id, newX, newY) => {
    setComponents((prev) =>
      prev.map((comp) =>
        comp.id === id ? { ...comp, x: newX, y: newY } : comp
      )
    );
  };

  const selectedComponent = components.find((c) => c.id === selectedId);

  const applyStyles = () => {
    setComponents((prev) =>
      prev.map((comp) =>
        comp.id === selectedId
          ? {
              ...comp,
              styles: {
                ...comp.styles,
                ...pendingStyles,
                width:
                  Math.min(parseInt(pendingStyles.width) || 900, 1000) + "px",
                height:
                  Math.min(parseInt(pendingStyles.height) || 300, 600) + "px",
              },
              value: pendingStyles.value || comp.value,
            }
          : comp
      )
    );
    setPendingStyles({});
  };

  const handleStyleChange = (key, val) => {
    setPendingStyles((prev) => ({ ...prev, [key]: val }));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen">
        <div className="w-1/5 bg-white border-r p-4 space-y-3">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <span>🛠️</span> Appsi Studio
          </h2>
          {["Text", "Image", "Button", "Pages"].map((item, index) => (
            <DraggableItem key={index} name={item} />
          ))}
        </div>

        <div className="flex-1 border-x p-6 relative overflow-hidden">
          <DropZone
            components={components}
            onDrop={handleDrop}
            onDelete={handleDelete}
            onSelect={setSelectedId}
            selectedId={selectedId}
            onExternalDrop={handleExternalDrop}
            onDragStop={onDragStop}
          />
        </div>

        <div className="w-1/4 bg-white shadow-md p-6 flex flex-col justify-between border-l">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4">
              ⚙️ Component Settings
            </h3>
            {selectedComponent ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    ✏️ Value / Label / Source
                  </label>
                  <input
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                    defaultValue={selectedComponent.value}
                    onChange={(e) => handleStyleChange("value", e.target.value)}
                  />
                </div>

                {/* Text Properties */}
                {selectedComponent.type === "Text" && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600">
                        🔠 Font Size (px)
                      </label>
                      <input
                        type="number"
                        className="w-full p-2 border rounded"
                        onChange={(e) =>
                          handleStyleChange("fontSize", `${e.target.value}px`)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600">
                        🎨 Text Color
                      </label>
                      <input
                        type="color"
                        className="w-full h-10 cursor-pointer"
                        onChange={(e) =>
                          handleStyleChange("color", e.target.value)
                        }
                      />
                    </div>
                  </>
                )}

                {/* Image Properties */}
                {selectedComponent.type === "Image" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          📏 Width
                        </label>
                        <input
                          type="number"
                          min="100"
                          max="1200"
                          className="w-full p-2 border rounded"
                          onChange={(e) =>
                            handleStyleChange("width", `${e.target.value}px`)
                          }
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          📐 Height
                        </label>
                        <input
                          type="number"
                          className="w-full p-2 border rounded"
                          onChange={(e) =>
                            handleStyleChange("height", `${e.target.value}px`)
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        💡 Brightness
                      </label>
                      <input
                        type="range"
                        min="0.5"
                        max="1.5"
                        step="0.1"
                        className="w-full"
                        onChange={(e) =>
                          handleStyleChange("brightness", e.target.value)
                        }
                      />
                    </div>
                  </>
                )}
                {/* Button Properties */}
                {selectedComponent.type === "Button" && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        🔠 Font Size (px)
                      </label>
                      <input
                        type="number"
                        className="w-full p-2 border rounded"
                        onChange={(e) =>
                          handleStyleChange("fontSize", `${e.target.value}px`)
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        🎨 Background Color
                      </label>
                      <input
                        type="color"
                        className="w-full h-10 cursor-pointer"
                        onChange={(e) =>
                          handleStyleChange("backgroundColor", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        🖍️ Text Color
                      </label>
                      <input
                        type="color"
                        className="w-full h-10 cursor-pointer"
                        onChange={(e) =>
                          handleStyleChange("color", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        📏 Padding
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 10px 20px"
                        className="w-full p-2 border rounded"
                        onChange={(e) =>
                          handleStyleChange("padding", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        🔳 Border Radius
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 8px"
                        className="w-full p-2 border rounded"
                        onChange={(e) =>
                          handleStyleChange("borderRadius", e.target.value)
                        }
                      />
                    </div>
                  </>
                )}
                {/* Page Properties */}
                {selectedComponent?.type === "Pages" && (
                  <>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      🌐 Website URL
                    </label>
                    <input
                      type="text"
                      placeholder="https://..."
                      className="w-full p-2 border rounded"
                      defaultValue={selectedComponent.value}
                      onChange={(e) =>
                        handleStyleChange("value", e.target.value)
                      }
                    />
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <input
                        type="number"
                        placeholder="Width"
                        className="p-2 border rounded"
                        onChange={(e) =>
                          handleStyleChange("width", `${e.target.value}px`)
                        }
                      />
                      <input
                        type="number"
                        placeholder="Height"
                        className="p-2 border rounded"
                        onChange={(e) =>
                          handleStyleChange("height", `${e.target.value}px`)
                        }
                      />
                    </div>
                  </>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic mt-2">
                Select a component to start editing...
              </p>
            )}
          </div>

          {components.length > 0 && (
            <button
              onClick={applyStyles}
              className="w-full py-3 m-auto bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 text-lg font-semibold shadow"
            >
              ✅ Apply Changes
            </button>
          )}
        </div>
      </div>
    </DndProvider>
  );
}
