import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingList, ShoppingItem, StorePriceQuote } from '../types';
import { Modal } from '../components/common/Modal';
import {
  ShoppingBag,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Receipt,
  DollarSign,
  Tag,
  ArrowUpDown,
  Filter,
  Scale,
  Award,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  History,
  Store,
} from 'lucide-react';

export const ShoppingPlannerPage: React.FC = () => {
  const {
    shoppingLists,
    addShoppingList,
    deleteShoppingList,
    addShoppingItem,
    toggleShoppingItem,
    deleteShoppingItem,
    addStoreQuoteToItem,
    removeStoreQuoteFromItem,
    selectPreferredStoreForItem,
    priceComparisons,
    formatCurrency,
  } = useApp();

  const [activeListId, setActiveListId] = useState<string>(() => {
    return shoppingLists[0]?.id || '';
  });

  // Modal states
  const [newListModal, setNewListModal] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const [newListBudget, setNewListBudget] = useState('5000');

  const [newItemModal, setNewItemModal] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemQty, setItemQty] = useState('1');
  const [itemUnit, setItemUnit] = useState('pcs');
  const [itemEstimatedPrice, setItemEstimatedPrice] = useState('');
  const [itemCategory, setItemCategory] = useState('Pantry');

  // Actual price prompt modal when checking off item
  const [markingItem, setMarkingItem] = useState<{ item: ShoppingItem; listId: string } | null>(null);
  const [actualPriceInput, setActualPriceInput] = useState('');

  // Item filter state
  const [itemFilter, setItemFilter] = useState<'all' | 'pending' | 'purchased'>('all');

  // Expanded item comparison drawer
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  // Add store quote modal
  const [addQuoteItem, setAddQuoteItem] = useState<{ listId: string; item: ShoppingItem } | null>(null);
  const [storeNameInput, setStoreNameInput] = useState('');
  const [quotePriceInput, setQuotePriceInput] = useState('');
  const [packageSizeInput, setPackageSizeInput] = useState('1');
  const [quoteUnitInput, setQuoteUnitInput] = useState('pcs');
  const [quoteNotesInput, setQuoteNotesInput] = useState('');

  // History / Saved Comparisons drawer
  const [showSavedComparisons, setShowSavedComparisons] = useState(false);

  const activeList = shoppingLists.find((l) => l.id === activeListId) || shoppingLists[0];

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListTitle.trim()) return;
    const b = parseFloat(newListBudget) || 0;
    const newId = addShoppingList(newListTitle.trim(), b);
    setActiveListId(newId);
    setNewListTitle('');
    setNewListBudget('5000');
    setNewListModal(false);
  };

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeList || !itemName.trim()) return;
    const est = parseFloat(itemEstimatedPrice) || 0;
    const qty = parseFloat(itemQty) || 1;

    addShoppingItem(activeList.id, {
      name: itemName.trim(),
      quantity: qty,
      unit: itemUnit.trim() || undefined,
      estimatedPrice: est,
      category: itemCategory.trim() || 'General',
    });

    setItemName('');
    setItemQty('1');
    setItemEstimatedPrice('');
    setNewItemModal(false);
  };

  const handleToggleClick = (item: ShoppingItem) => {
    if (!activeList) return;
    if (item.isPurchased) {
      toggleShoppingItem(activeList.id, item.id);
    } else {
      setMarkingItem({ item, listId: activeList.id });
      setActualPriceInput(String(item.estimatedPrice));
    }
  };

  const handleConfirmPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!markingItem) return;
    const actual = parseFloat(actualPriceInput);
    toggleShoppingItem(
      markingItem.listId,
      markingItem.item.id,
      isNaN(actual) ? markingItem.item.estimatedPrice : actual
    );
    setMarkingItem(null);
  };

  const handleSaveStoreQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addQuoteItem || !storeNameInput.trim()) return;
    const p = parseFloat(quotePriceInput) || 0;
    const sz = parseFloat(packageSizeInput) || 1;

    addStoreQuoteToItem(addQuoteItem.listId, addQuoteItem.item.id, {
      storeName: storeNameInput.trim(),
      price: p,
      packageSize: sz,
      unit: quoteUnitInput.trim() || 'pcs',
      notes: quoteNotesInput.trim() || undefined,
    });

    setStoreNameInput('');
    setQuotePriceInput('');
    setQuoteNotesInput('');
    setAddQuoteItem(null);
  };

  // Import product from global comparisons into shopping list
  const handleImportFromComparison = (comp: any) => {
    if (!activeList) return;
    const bestQuote = [...comp.items].sort((a: any, b: any) => a.price - b.price)[0];
    addShoppingItem(activeList.id, {
      name: comp.productName,
      quantity: 1,
      unit: bestQuote?.unit || 'unit',
      estimatedPrice: bestQuote?.price || 100,
      category: comp.category,
      preferredStore: bestQuote?.storeName,
      storeQuotes: comp.items.map((it: any) => ({
        id: 'sq_' + Math.random().toString(36).substring(2, 7),
        storeName: it.storeName,
        price: it.price,
        packageSize: it.packageSize,
        unit: it.unit,
        notes: it.notes,
      })),
    });
    setShowSavedComparisons(false);
  };

  // Calculations for current active list
  const items = activeList?.items || [];
  const filteredItems = items.filter((it) => {
    if (itemFilter === 'pending') return !it.isPurchased;
    if (itemFilter === 'purchased') return it.isPurchased;
    return true;
  });

  const estimatedTotal = items.reduce((s, it) => s + (it.estimatedPrice * (it.quantity || 1)), 0);
  const purchasedTotal = items
    .filter((it) => it.isPurchased)
    .reduce((s, it) => s + ((it.actualPrice ?? it.estimatedPrice) * (it.quantity || 1)), 0);

  const budget = activeList?.budget || 0;
  const remainingAllowance = budget - (purchasedTotal + items.filter(i => !i.isPurchased).reduce((s, i) => s + (i.estimatedPrice * (i.quantity || 1)), 0));
  const isOverBudget = remainingAllowance < 0;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Smart Shopping Planner & Store Comparison
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Plan planned grocery checklists, compare retail store quotes side-by-side, and lock in the lowest unit prices.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowSavedComparisons(!showSavedComparisons)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <History className="w-3.5 h-3.5 text-slate-400" />
            <span>Saved Comparisons ({priceComparisons.length})</span>
          </button>
          <button
            onClick={() => setNewListModal(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Shopping List</span>
          </button>
        </div>
      </div>

      {/* Saved Comparisons Drawer (Quick import) */}
      {showSavedComparisons && (
        <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                Import from Saved Price Comparisons
              </h3>
            </div>
            <span className="text-[11px] text-slate-500">Click to import with pre-calculated store quotes</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {priceComparisons.map((comp) => {
              const best = [...comp.items].sort((a, b) => a.price - b.price)[0];
              return (
                <div
                  key={comp.id}
                  className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <span className="font-semibold text-xs text-slate-900 dark:text-white truncate block">
                      {comp.productName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Lowest: {formatCurrency(best?.price || 0)} ({best?.storeName})
                    </span>
                  </div>
                  <button
                    onClick={() => handleImportFromComparison(comp)}
                    className="px-2 py-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold text-[11px] rounded hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors shrink-0"
                  >
                    + Add to List
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Shopping Lists Switcher Pills */}
      {shoppingLists.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {shoppingLists.map((list) => {
            const isActive = list.id === activeList?.id;
            return (
              <button
                key={list.id}
                onClick={() => {
                  setActiveListId(list.id);
                  setExpandedItemId(null);
                }}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors flex items-center gap-2 ${
                  isActive
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                }`}
              >
                <span>{list.title}</span>
                <span className="text-[10px] opacity-75">
                  ({list.items.filter((i) => i.isPurchased).length}/{list.items.length})
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Main Active List Workspace */}
      {!activeList ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-3">
          <ShoppingBag className="w-10 h-10 text-slate-400 mx-auto opacity-50" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No Shopping Lists Found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Create your first list to plan groceries, appliances, or household consumables.
          </p>
          <button
            onClick={() => setNewListModal(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-lg"
          >
            Create Shopping List
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Strip for active list */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
                List Budget Target
              </span>
              <span className="text-xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                {formatCurrency(budget)}
              </span>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
                Estimated Total Outflow
              </span>
              <span className="text-xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                {formatCurrency(estimatedTotal)}
              </span>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
                Purchased Actual Total
              </span>
              <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
                {formatCurrency(purchasedTotal)}
              </span>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1">
                Allowance Remaining
              </span>
              <span
                className={`text-xl font-bold font-mono tabular-nums ${
                  isOverBudget ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'
                }`}
              >
                {formatCurrency(remainingAllowance)}
              </span>
            </div>
          </div>

          {/* Budget Warning Banner if over budget */}
          {isOverBudget && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
              <div className="text-xs text-rose-800 dark:text-rose-200">
                <strong className="font-bold">Shopping Budget Exceeded:</strong> The items in this list exceed your target limit of {formatCurrency(budget)} by {formatCurrency(Math.abs(remainingAllowance))}. Compare store prices below to lock in the lowest quotes.
              </div>
            </div>
          )}

          {/* Items Table Container */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Items in {activeList.title}
                </h3>
                <span className="text-xs text-slate-400">
                  {items.length} items
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
                  <button
                    onClick={() => setItemFilter('all')}
                    className={`px-2.5 py-1 rounded font-medium transition-colors ${
                      itemFilter === 'all'
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                        : 'text-slate-500'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setItemFilter('pending')}
                    className={`px-2.5 py-1 rounded font-medium transition-colors ${
                      itemFilter === 'pending'
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                        : 'text-slate-500'
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => setItemFilter('purchased')}
                    className={`px-2.5 py-1 rounded font-medium transition-colors ${
                      itemFilter === 'purchased'
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                        : 'text-slate-500'
                    }`}
                  >
                    Purchased
                  </button>
                </div>

                <button
                  onClick={() => setNewItemModal(true)}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Item</span>
                </button>

                <button
                  onClick={() => deleteShoppingList(activeList.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                  title="Delete this shopping list"
                  aria-label="Delete shopping list"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {filteredItems.length === 0 ? (
              <div className="py-12 px-6 text-center text-xs text-slate-400">
                No items match the selected filter.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredItems.map((item) => {
                  const hasVariance = item.isPurchased && item.actualPrice !== undefined;
                  const variance = hasVariance ? (item.actualPrice! - item.estimatedPrice) : 0;
                  const isExpanded = expandedItemId === item.id;
                  const quotes = item.storeQuotes || [];

                  // Sort quotes to find lowest price
                  const sortedQuotes = [...quotes].sort((a, b) => {
                    const rateA = a.packageSize > 0 ? a.price / a.packageSize : a.price;
                    const rateB = b.packageSize > 0 ? b.price / b.packageSize : b.price;
                    return rateA - rateB;
                  });
                  const lowestQuote = sortedQuotes[0];
                  const highestQuote = sortedQuotes[sortedQuotes.length - 1];
                  const potentialSavings = highestQuote && lowestQuote && highestQuote !== lowestQuote
                    ? highestQuote.price - lowestQuote.price
                    : 0;

                  return (
                    <div
                      key={item.id}
                      className={`transition-colors ${
                        item.isPurchased ? 'bg-slate-50/50 dark:bg-slate-800/20' : ''
                      }`}
                    >
                      {/* Main Item Row */}
                      <div className="p-3.5 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3 min-w-0">
                          <button
                            onClick={() => handleToggleClick(item)}
                            className="text-slate-400 hover:text-emerald-500 shrink-0 transition-colors"
                            aria-label={item.isPurchased ? 'Mark item as pending' : 'Mark item as purchased'}
                          >
                            {item.isPurchased ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            ) : (
                              <Circle className="w-5 h-5" />
                            )}
                          </button>
                          <div className="min-w-0">
                            <p
                              className={`font-semibold truncate ${
                                item.isPurchased
                                  ? 'line-through text-slate-400 dark:text-slate-500'
                                  : 'text-slate-900 dark:text-white'
                              }`}
                            >
                              {item.name}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                              <span>
                                Qty: {item.quantity} {item.unit || ''}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span>{item.category}</span>
                              {item.preferredStore && (
                                <>
                                  <span aria-hidden="true">·</span>
                                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                                    Store: {item.preferredStore}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          {/* Store Comparison Trigger Button */}
                          <button
                            onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                            className={`px-2.5 py-1 text-[11px] font-semibold rounded-md border transition-colors flex items-center gap-1.5 ${
                              isExpanded || quotes.length > 0
                                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <Scale className="w-3 h-3" />
                            <span>Compare ({quotes.length})</span>
                            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>

                          <div className="text-right">
                            <div className="font-mono tabular-nums font-bold text-slate-900 dark:text-white">
                              {formatCurrency(
                                item.isPurchased && item.actualPrice !== undefined
                                  ? item.actualPrice * item.quantity
                                  : item.estimatedPrice * item.quantity
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {item.isPurchased ? (
                                <span>
                                  Est: {formatCurrency(item.estimatedPrice * item.quantity)}
                                  {variance !== 0 && (
                                    <span
                                      className={`ml-1 font-semibold ${
                                        variance > 0 ? 'text-rose-500' : 'text-emerald-500'
                                      }`}
                                    >
                                      ({variance > 0 ? '+' : ''}
                                      {formatCurrency(variance * item.quantity)})
                                    </span>
                                  )}
                                </span>
                              ) : (
                                <span>Est. unit: {formatCurrency(item.estimatedPrice)}</span>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={() => deleteShoppingItem(activeList.id, item.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-500 rounded-md transition-colors"
                            title="Delete Item"
                            aria-label={`Delete ${item.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Feature 2: Side-by-Side Store Price Comparison Expanded Drawer */}
                      {isExpanded && (
                        <div className="bg-slate-50/80 dark:bg-slate-950/60 p-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                <Store className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                <span>Store Price Quotes for &quot;{item.name}&quot;</span>
                              </span>
                              <span className="text-[11px] text-slate-500">
                                Side-by-side pricing from local & online retailers
                              </span>
                            </div>

                            <button
                              onClick={() => {
                                setAddQuoteItem({ listId: activeList.id, item });
                                setStoreNameInput('');
                                setQuotePriceInput('');
                                setPackageSizeInput('1');
                                setQuoteUnitInput(item.unit || 'pcs');
                              }}
                              className="px-2.5 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded flex items-center gap-1 self-start sm:self-auto"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add Store Quote</span>
                            </button>
                          </div>

                          {quotes.length === 0 ? (
                            <div className="py-4 text-center text-xs text-slate-400 bg-white dark:bg-slate-900 rounded-lg border border-dashed border-slate-200 dark:border-slate-800">
                              No store quotes entered yet. Click &quot;Add Store Quote&quot; to compare prices between Amazon, Walmart, or local grocers.
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                                {sortedQuotes.map((quote, idx) => {
                                  const isLowest = idx === 0;
                                  const unitRate = quote.packageSize > 0 ? quote.price / quote.packageSize : quote.price;
                                  const isPreferred = item.preferredStore === quote.storeName;

                                  return (
                                    <div
                                      key={quote.id}
                                      className={`p-3 rounded-lg border transition-all text-xs space-y-1.5 ${
                                        isLowest
                                          ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                                      }`}
                                    >
                                      <div className="flex items-center justify-between">
                                        <span className="font-bold text-slate-900 dark:text-white truncate">
                                          {quote.storeName}
                                        </span>
                                        {isLowest && (
                                          <span className="px-1.5 py-0.5 text-[9px] font-bold bg-emerald-600 text-white rounded">
                                            LOWEST PRICE
                                          </span>
                                        )}
                                      </div>

                                      <div className="flex items-baseline justify-between font-mono">
                                        <span className="text-base font-bold text-slate-900 dark:text-white">
                                          {formatCurrency(quote.price)}
                                        </span>
                                        <span className="text-[10px] text-slate-400">
                                          {formatCurrency(unitRate)}/{quote.unit}
                                        </span>
                                      </div>

                                      {quote.notes && (
                                        <p className="text-[10px] text-slate-500 truncate">{quote.notes}</p>
                                      )}

                                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                                        <button
                                          onClick={() => selectPreferredStoreForItem(activeList.id, item.id, quote.storeName, quote.price)}
                                          className={`text-[10px] font-semibold transition-colors ${
                                            isPreferred
                                              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                                              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                                          }`}
                                        >
                                          {isPreferred ? '✓ Selected' : 'Use This Price'}
                                        </button>
                                        <button
                                          onClick={() => removeStoreQuoteFromItem(activeList.id, item.id, quote.id)}
                                          className="text-slate-400 hover:text-rose-500 p-0.5"
                                          title="Remove quote"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>

                              {potentialSavings > 0 && (
                                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                                  <span>
                                    <strong>Identified Savings:</strong> Choosing <strong>{lowestQuote.storeName}</strong> saves approx{' '}
                                    <strong>{formatCurrency(potentialSavings)}</strong> per unit compared with {highestQuote.storeName}.
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* New Shopping List Modal */}
      {newListModal && (
        <Modal
          isOpen={true}
          onClose={() => setNewListModal(false)}
          title="Create Shopping List"
          description="Prepare a dedicated budget and item checklist."
        >
          <form onSubmit={handleCreateList} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                List Title *
              </label>
              <input
                type="text"
                required
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                placeholder="e.g., Weekly Supermarket Groceries"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Budget Limit *
              </label>
              <input
                type="number"
                min="0"
                step="any"
                required
                value={newListBudget}
                onChange={(e) => setNewListBudget(e.target.value)}
                placeholder="e.g., 5000"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-hidden"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setNewListModal(false)}
                className="px-4 py-2 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg"
              >
                Create List
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add Item Modal */}
      {newItemModal && (
        <Modal
          isOpen={true}
          onClose={() => setNewItemModal(false)}
          title="Add Item to Shopping List"
          description="Enter product details, quantity, and estimated unit cost."
        >
          <form onSubmit={handleCreateItem} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Item Name *
              </label>
              <input
                type="text"
                required
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="e.g., Cold Pressed Virgin Olive Oil 1L"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Quantity *
                </label>
                <input
                  type="number"
                  min="0.1"
                  step="any"
                  required
                  value={itemQty}
                  onChange={(e) => setItemQty(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Unit (e.g. pcs, kg, L)
                </label>
                <input
                  type="text"
                  value={itemUnit}
                  onChange={(e) => setItemUnit(e.target.value)}
                  placeholder="pcs, pack, L, kg"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Estimated Unit Price *
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  required
                  value={itemEstimatedPrice}
                  onChange={(e) => setItemEstimatedPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={itemCategory}
                  onChange={(e) => setItemCategory(e.target.value)}
                  placeholder="Pantry, Dairy, Tech, etc."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setNewItemModal(false)}
                className="px-4 py-2 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg"
              >
                Add to List
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add Store Quote Modal for Item */}
      {addQuoteItem && (
        <Modal
          isOpen={true}
          onClose={() => setAddQuoteItem(null)}
          title={`Add Store Quote for "${addQuoteItem.item.name}"`}
          description="Enter price quote from a verified store or online listing."
        >
          <form onSubmit={handleSaveStoreQuote} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Store or Seller Name *
              </label>
              <input
                type="text"
                required
                value={storeNameInput}
                onChange={(e) => setStoreNameInput(e.target.value)}
                placeholder="e.g., Amazon Prime, Walmart, Blinkit"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Price *
                </label>
                <input
                  type="number"
                  step="any"
                  min="0.01"
                  required
                  value={quotePriceInput}
                  onChange={(e) => setQuotePriceInput(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-hidden"
                />
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Pack Size
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={packageSizeInput}
                    onChange={(e) => setPackageSizeInput(e.target.value)}
                    placeholder="1"
                    className="w-full px-2 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Unit
                  </label>
                  <input
                    type="text"
                    value={quoteUnitInput}
                    onChange={(e) => setQuoteUnitInput(e.target.value)}
                    placeholder="pcs, kg"
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
                value={quoteNotesInput}
                onChange={(e) => setQuoteNotesInput(e.target.value)}
                placeholder="e.g., Weekend flash discount, free delivery"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setAddQuoteItem(null)}
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

      {/* Confirm Purchase Price Modal */}
      {markingItem && (
        <Modal
          isOpen={true}
          onClose={() => setMarkingItem(null)}
          title={`Mark "${markingItem.item.name}" as Purchased`}
          description="Confirm actual checkout price to evaluate your estimation accuracy."
        >
          <form onSubmit={handleConfirmPurchase} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Actual Unit Price Paid
              </label>
              <input
                type="number"
                step="any"
                min="0"
                required
                value={actualPriceInput}
                onChange={(e) => setActualPriceInput(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-hidden"
              />
              <span className="text-[11px] text-slate-400 block mt-1">
                Original estimate was {formatCurrency(markingItem.item.estimatedPrice)}
              </span>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setMarkingItem(null)}
                className="px-4 py-2 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg"
              >
                Confirm Purchase
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
