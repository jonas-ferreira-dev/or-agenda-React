type PublicSlotsProps = {
  slots: string[];
  selectedSlot: string;
  onSelect: (slot: string) => void;
};

export function PublicSlots({
  slots,
  selectedSlot,
  onSelect,
}: PublicSlotsProps) {
  if (!slots.length) {
    return (
      <div className="public-empty-state">
        <p>Nenhum horário disponível para esta data.</p>
      </div>
    );
  }

  return (
    <div className="public-slots-grid">
      {slots.map((slot) => (
        <button
          key={slot}
          type="button"
          className={`public-slot-button ${
            selectedSlot === slot ? 'selected' : ''
          }`}
          onClick={() => onSelect(slot)}
        >
          {slot}
        </button>
      ))}
    </div>
  );
}