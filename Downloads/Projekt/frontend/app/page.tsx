'use client';

import { useEffect, useState } from 'react';

type ProductAssignment = {
  baureihe: string;
  models: string[];
};

type Product = {
  _id: string;
  code: string;
  name: string;
  variantCount: number;
  assignments?: ProductAssignment[];
};

export default function Home() {
  const [name, setName] = useState('');
  const [products, setProducts] = useState<Product[]>([]);

  const baureihen = [
    { name: '964', models: ['Coupe', 'Cabrio', 'Targa', 'Turbo'] },
    { name: 'GT', models: ['GT3', 'GT3 RS'] },
    { name: '993', models: ['Coupe', 'Cabrio'] },
  ];

  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [isModelOpen, setIsModelOpen] = useState(false);

  const [selectedBaureihe, setSelectedBaureihe] = useState('');

  const loadProducts = async (): Promise<void> => {
    try {
      const res = await fetch('http://localhost:3001/products');
      const data = (await res.json()) as Product[];
      setProducts(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    void loadProducts();
  }, []);

  const createProduct = async (): Promise<void> => {
    if (!name.trim()) return;
    if (!selectedBaureihe || selectedModels.length === 0) {
      alert('Bitte Baureihe und Modell auswählen.');
      return;
    }

    const assignments: ProductAssignment[] = [
      {
        baureihe: selectedBaureihe,
        models: selectedModels,
      },
    ];

    try {
      const res = await fetch('http://localhost:3001/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, assignments }),
      });

      if (res.ok) {
        setName('');
        setSelectedBaureihe('');
        setSelectedModels([]);
        await loadProducts();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Neues Produkt anlegen</h2>

      <input
        type="text"
        placeholder="Produktname..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ marginRight: '10px' }}
      />

      {/* Baureihe */}
      <select
        value={selectedBaureihe}
        onChange={(e) => setSelectedBaureihe(e.target.value)}
        style={{ marginRight: '10px' }}
      >
        <option value="">-- Baureihe wählen --</option>
        {baureihen.map((b) => (
          <option key={b.name} value={b.name}>
            {b.name}
          </option>
        ))}
      </select>

      {/* Modell */}
      <div
        style={{
          position: 'relative',
          display: 'inline-block',
          marginRight: '10px',
        }}
      >
        <button
          type="button"
          onClick={() => setIsModelOpen(!isModelOpen)}
          disabled={!selectedBaureihe}
        >
          {selectedModels.length > 0
            ? selectedModels.join(', ')
            : '-- Modelle wählen --'}
        </button>

        {isModelOpen && selectedBaureihe && (
          <div
            style={{
              position: 'absolute',
              background: 'white',
              border: '1px solid #ccc',
              padding: '10px',
              zIndex: 10,
            }}
          >
            {baureihen
              .find((b) => b.name === selectedBaureihe)!
              .models.map((model) => (
                <label key={model} style={{ display: 'block' }}>
                  <input
                    type="checkbox"
                    checked={selectedModels.includes(model)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedModels([...selectedModels, model]);
                      } else {
                        setSelectedModels(
                          selectedModels.filter((m) => m !== model),
                        );
                      }
                    }}
                  />
                  {model}
                </label>
              ))}
          </div>
        )}
      </div>

      <button onClick={() => void createProduct()}>Speichern</button>

      {/* Tabelle */}
      <table
        border={1}
        style={{ borderCollapse: 'collapse', width: '100%', marginTop: '20px' }}
      >
        <thead>
          <tr>
            <th>Produkt-Code</th>
            <th>Produktname</th>
            <th>Variante</th>
            <th>Baureihe</th>
            <th>Modell</th>
          </tr>
        </thead>

        <tbody>
          {/* Produkte vom Backend */}
          {products.map((row) =>
            row.assignments && row.assignments.length > 0 ? (
              row.assignments.map((a, aIdx) => (
                <tr key={`${row._id}-${aIdx}`}>
                  <td>{row.code}</td>
                  <td>{row.name}</td>
                  <td>{row.variantCount}</td>
                  <td>{a.baureihe}</td>
                  <td>{a.models.join(', ')}</td>
                </tr>
              ))
            ) : (
              <tr key={row._id}>
                <td>{row.code}</td>
                <td>{row.name}</td>
                <td>{row.variantCount}</td>
                <td>-</td>
                <td>-</td>
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  );
}
