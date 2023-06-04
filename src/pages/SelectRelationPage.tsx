export const SelectRelationPage: React.FC<{
  onSelect(relationId: number): void;
}> = ({ onSelect }) => {
  return (
    <>
      what u want to do?
      <button type="button" onClick={() => onSelect(-1)}>
        Create new relation
      </button>
      <button
        type="button"
        onClick={() => {
          // eslint-disable-next-line no-alert
          const id = prompt("what is relation ID number?");
          if (id === null) return;
          if (Number.isNaN(+id)) return;
          onSelect(+id);
        }}
      >
        Edit Existing relation
      </button>
    </>
  );
};
