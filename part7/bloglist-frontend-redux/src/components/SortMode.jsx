const SortMode = ({ sortMode, setSortMode, sortModes }) => (
  <form>
    {sortModes.map(sm =>
      <div key={sm}>
        <input type="radio" onChange={() => setSortMode(sm)} id={sm} name="sortMode" value={sm} checked={sm === sortMode} />
        <label for={sm}>{sm}</label>
      </div>
    )}
  </form>
)

export default SortMode