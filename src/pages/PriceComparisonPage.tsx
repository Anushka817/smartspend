import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PriceComparison, StorePriceItem } from '../types';
import { Modal } from '../components/common/Modal';
import {
  Scale,
  Plus,
  Trash2,
  ExternalLink,
  Award,
  Sparkles,
  ArrowUpDown,
  Search,
  CheckCircle2,
  Info,
  TrendingDown,
} from 'lucide-react';

export const PriceComparisonPage: React.FC = () => {
  const {
    priceComparisons,
    addPriceComparison,
    deletePriceComparison,
    addStoreItemToComparison,
    deleteStoreItemFromComparison,
    formatCurrency,
  } = useApp();

  const [activeCompId, setActiveCompId] = useState<string>(() => {
    return priceComparisons[0]?.id || '';
  });

  const [newComparisonModal, setNewComparisonModal] = useState(false);
  const [productName, setProductName] = useState('');
  const [productCategory, setProductCategory] = useState('Groceries');

  const [newStoreModal, setNewStoreModal] = useState(false);
  const [storeName, setStoreName] = useState('');
  const [storeProductName, setStoreProductName] = useState('');
  const [storePrice, setStorePrice] = useState('');
  const [storePackageSize, setStorePackageSize] = useState('1000');
  const [storeUnit, setStoreUnit] = useState('g');
  const [storeUrl, setStoreUrl] = useState('');
  const [storeNotes, setStoreNotes] = useState('');

  const activeComp = priceComparisons.find((c) => c.id === activeCompId) || priceComparisons[0];

  const handleCreateComparison = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim()) return;
    addPriceComparison(productName.trim(), productCategory.trim() || 'General', []);
    setProductName('');
    setNewComparisonModal(false);
  };

  const handleAddStoreItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeComp || !storeName.trim()) return;
    const price = parseFloat(storePrice) || 0;
    const pkg = parseFloat(storePackageSize) || 1;

    addStoreItemToComparison(activeComp.id, {
      storeName: storeName.trim(),
      productName: storeProductName.trim() || activeComp.productName,
      price,
      packageSize: pkg,
      unit: storeUnit.trim() || 'unit',
      productUrl: storeUrl.trim() || undefined,
      notes: storeNotes.trim() || undefined,
    });

    setStoreName('');
    setStoreProductName('');
    setStorePrice('');
    setStoreNotes('');
    setStoreUrl('');
    setNewStoreModal(false);
  };

  // Unit rate calculation: normalized to 100 units (e.g. per 100g or per 100ml or per 1 unit)
  const itemsWithUnitRates = React.useMemo(() => {
    if (!activeComp) return [];
    return activeComp.items
      .map((it) => {
        const unitRate = it.packageSize > 0 ? (it.price / it.packageSize) * 100 : it.price;
        return {
          ...it,
          normalizedRatePer100: unitRate,
        };
      })
      .sort((a, b) => a.normalizedRatePer100 - b.normalizedRatePer100);
  }, [activeComp]);

  const lowestItem = itemsWithUnitRates[0];
  const highestItem = itemsWithUnitRates[itemsWithUnitRates.length - 1];
  const maxSavings = highestItem && lowestItem && highestItem !== lowestItem
    ? highestItem.price - lowestItem.price
    : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Product Price Comparison
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Compare retail prices across local stores & online merchants. Automatically normalizes unit rates.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setNewComparisonModal(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Comparison</span>
          </button>
        </div>
      </div>

      {/* Manual Transparency Callout */}
      <div className="p-3.5 bg-slate-100 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
        <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold text-slate-900 dark:text-white">
            Manual Verified Price Comparison:
          </strong>{' '}
          Input store quotes from your local supermarket receipts or online apps. SmartSpend standardizes packaging sizes (per 100g, 100ml, or unit) to defeat deceptive package downsizing.
        </div>
      </div>

      {/* Comparisons Selector Pills */}
      {priceComparisons.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {priceComparisons.map((c) => {
            const isActive = c.id === activeComp?.id;
            return (
              <button
                key={c.id}
                onClick={() => setActiveCompId(c.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors flex items-center gap-2 ${
                  isActive
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                }`}
              >
                <span>{c.productName}</span>
                <span className="text-[10px] opacity-75">({c.items.length} stores)</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Main Comparison Area */}
      {!activeComp ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-3">
          <Scale className="w-10 h-10 text-slate-400 mx-auto opacity-50" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No Saved Price Comparisons
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Compare essential groceries, pantry staples, or electronics across different sellers.
          </p>
          <button
            onClick={() => setNewComparisonModal(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-lg"
          >
            Create Comparison
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Best Deal Spotlight Strip */}
          {lowestItem && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block">
                    Best Unit Rate Identified
                  </span>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {lowestItem.storeName} ({formatCurrency(lowestItem.price)} for {lowestItem.packageSize}
                    {lowestItem.unit})
                  </p>
                  <span className="text-xs text-emerald-700 dark:text-emerald-300 font-mono">
                    Normalized: {formatCurrency(lowestItem.normalizedRatePer100)} per 100{lowestItem.unit}
                  </span>
                </div>
              </div>

              {maxSavings > 0 && (
                <div className="sm:text-right">
                  <span className="text-[11px] text-emerald-800 dark:text-emerald-300 block">
                    Max Potential Savings
                  </span>
                  <span className="text-lg font-bold font-mono text-emerald-700 dark:text-emerald-400">
                    Up to {formatCurrency(maxSavings)} cheaper
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Side by side Store Table */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Store Pricing Comparison for {activeComp.productName}
                </h3>
                <span className="text-xs text-slate-400">{activeComp.category}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setNewStoreModal(true)}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Store Quote</span>
                </button>
                <button
                  onClick={() => deletePriceComparison(activeComp.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg"
                  title="Delete Comparison"
                  aria-label="Delete comparison"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {itemsWithUnitRates.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No store quotes added yet. Click &quot;Add Store Quote&quot; to begin comparing prices.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400">
                      <th className="py-3 px-4 font-semibold">Store / Retailer</th>
                      <th className="py-3 px-4 font-semibold">Listing Name</th>
                      <th className="py-3 px-4 font-semibold">Pack Size</th>
                      <th className="py-3 px-4 font-semibold text-right">Pack Price</th>
                      <th className="py-3 px-4 font-semibold text-right">Normalized (100{lowestItem?.unit || 'u'})</th>
                      <th className="py-3 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {itemsWithUnitRates.map((store, idx) => {
                      const isBest = idx === 0;
                      return (
                        <tr
                          key={store.id}
                          className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                            isBest ? 'bg-emerald-50/30 dark:bg-emerald-950/20' : ''
                          }`}
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              {isBest && (
                                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-emerald-600 text-white rounded">
                                  BEST
                                </span>
                              )}
                              <span className="font-semibold text-slate-900 dark:text-white">
                                {store.storeName}
                              </span>
                            </div>
                            {store.notes && (
                              <span className="text-[11px] text-slate-400 block mt-0.5">
                                {store.notes}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                            {store.productName}
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-300">
                            {store.packageSize} {store.unit}
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                            {formatCurrency(store.price)}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span
                              className={`font-mono font-bold ${
                                isBest
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : 'text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              {formatCurrency(store.normalizedRatePer100)}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {store.productUrl && (
                                <a
                                  href={store.productUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1 text-slate-400 hover:text-emerald-500"
                                  title="Visit store link"
                                  aria-label="Visit store link"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}
                              <button
                                onClick={() => deleteStoreItemFromComparison(activeComp.id, store.id)}
                                className="p-1 text-slate-400 hover:text-rose-500"
                                title="Remove quote"
                                aria-label="Remove quote"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* New Comparison Modal */}
      {newComparisonModal && (
        <Modal
          isOpen={true}
          onClose={() => setNewComparisonModal(false)}
          title="Create Product Price Comparison"
          description="Track prices across multiple merchants for any product or staple."
        >
          <form onSubmit={handleCreateComparison} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Generic Product Name *
              </label>
              <input
                type="text"
                required
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g., Cold Pressed Extra Virgin Olive Oil"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <input
                type="text"
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
                placeholder="e.g., Grocery, Electronics, Personal Care"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>
            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setNewComparisonModal(false)}
                className="px-4 py-2 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg"
              >
                Create Comparison
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add Store Quote Modal */}
      {newStoreModal && (
        <Modal
          isOpen={true}
          onClose={() => setNewStoreModal(false)}
          title={`Add Store Quote to "${activeComp?.productName}"`}
          description="Enter price, package quantity, and store identity."
        >
          <form onSubmit={handleAddStoreItem} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Store or Seller Name *
              </label>
              <input
                type="text"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="e.g., Amazon, Walmart, Local Grocer, Blinkit"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Pack Price *
                </label>
                <input
                  type="number"
                  step="any"
                  min="0.01"
                  required
                  value={storePrice}
                  onChange={(e) => setStorePrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-hidden"
                />
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Size
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={storePackageSize}
                    onChange={(e) => setStorePackageSize(e.target.value)}
                    placeholder="1000"
                    className="w-full px-2 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Unit
                  </label>
                  <input
                    type="text"
                    value={storeUnit}
                    onChange={(e) => setStoreUnit(e.target.value)}
                    placeholder="g, ml, pcs"
                    className="w-full px-2 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Store Notes / Promo Details
              </label>
              <input
                type="text"
                value={storeNotes}
                onChange={(e) => setStoreNotes(e.target.value)}
                placeholder="e.g., Free delivery with Prime, In-store discount"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Product URL (Optional)
              </label>
              <input
                type="url"
                value={storeUrl}
                onChange={(e) => setStoreUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setNewStoreModal(false)}
                className="px-4 py-2 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg"
              >
                Save Store Quote
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
