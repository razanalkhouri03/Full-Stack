"use client";

export default function Home() {
  return (
  <div>
  <input type="text" placeholder="Gib etwas ein..." />

      <button>
        Speichern
      </button>
      <div>
  <table border={1} style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>Wert</th>
            <th>Produkt</th>
          </tr>
        </thead>
        <tbody>
         
        </tbody>
      </table>
</div>
      </div>
  );
}