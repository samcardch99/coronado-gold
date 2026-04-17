import { useState, useEffect, useCallback, useRef } from "react";

// Limita el ancho de la imagen en el CDN de Shopify (React no puede usar astro:assets)
const shopifyImg = (url, maxWidth) => {
  if (!url) return url;
  try {
    const u = new URL(url);
    u.searchParams.set("width", String(maxWidth));
    return u.toString();
  } catch {
    return url;
  }
};
import { toast, Toaster } from "sonner";
import {
  getCart,
  addToCart,
  updateCartLine,
  removeCartLine,
  removeCartLines,
  countItems,
  dispatchCartUpdated,
} from "../utils/shopifyCart";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatMoney(amount, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(parseFloat(amount));
}

// ─── Mini spinner ─────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <svg
      className="animate-spin w-5 h-5 text-darkRed/50"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8H4z"
      />
    </svg>
  );
}

// ─── Checkbox elegante Coronado Gold ─────────────────────────────────────────

function Checkbox({ checked, onChange }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onChange(); }}
      aria-label={checked ? "Deselect item" : "Select item"}
      className="shrink-0 self-center cursor-pointer group"
    >
      <div
        className={`w-[15px] h-[15px] md:w-[26px] md:h-[26px] lg:w-[20px] lg:h-[20px] rounded-[3px] border transition-all duration-200 flex items-center justify-center
          ${checked
            ? "bg-darkRed border-darkRed"
            : "bg-transparent border-darkRed/25 group-hover:border-darkRed/60"
          }`}
      >
        {checked && (
          <svg viewBox="0 0 10 8" fill="none" className="w-[9px] h-[7px] md:w-[16px] md:h-[13px] lg:w-[12px] lg:h-[10px]">
            <path
              d="M1 4L3.5 6.5L9 1"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
    </button>
  );
}

// ─── Single cart line item ────────────────────────────────────────────────────

function CartItem({ line, onUpdate, onRemove, busy, quantityAvailable, selected, onToggle }) {
  const { id, quantity, merchandise } = line;
  const { product, price } = merchandise;
  const image = product.images?.edges?.[0]?.node;
  const variantLabel =
    merchandise.title !== "Default Title" ? merchandise.title : null;
  const kilates = product.kilates?.value ?? null;

  const atMaxStock = quantityAvailable != null && quantity >= quantityAvailable;

  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div
      onClick={() => onToggle(id)}
      className={`flex gap-3 p-6 border-b my-3 border-darkRed/10 last:border-0 rounded-xl transition-colors duration-300 -mx-3 cursor-pointer select-none
        ${selected ? "bg-darkRed/6" : "bg-transparent"}`}
    >
      {/* Checkbox */}
      <Checkbox checked={selected} onChange={() => onToggle(id)} />

      {/* Thumbnail */}
      <div className="w-20 aspect-square md:w-44 lg:w-40 shrink-0 border border-darkRed/20 rounded-md overflow-hidden relative">
        {image?.url ? (
          <>
            {/* Skeleton: visible hasta que la imagen carga */}
            <div
              className={`skeleton absolute inset-0 transition-opacity duration-500 ${imgLoaded ? "opacity-0 pointer-events-none" : "opacity-100"}`}
            />
            <img
              src={shopifyImg(image.url, 320)}
              alt={image.altText || product.title}
              onLoad={() => setImgLoaded(true)}
              className="w-full h-full object-contain p-1"
            />
          </>
        ) : (
          <div className="w-full h-full bg-light" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <p className="font-serif text-sm md:text-4xl lg:text-3xl tracking-widest uppercase leading-snug text-darkRed truncate">
            {product.title}
          </p>
          {variantLabel && (
            <p className="text-xs tracking-wider text-darkRed/60 mt-0.5 uppercase">
              {variantLabel}
            </p>
          )}
          {kilates && (
            <p className="text-xs md:text-xl lg:text-xl tracking-wider text-darkRed/45 mt-0.5 uppercase">
              {kilates}k gold
            </p>
          )}
          {atMaxStock && (
            <p className="text-[10px] tracking-wider text-darkRed/50 mt-1 uppercase">
              Max stock reached
            </p>
          )}
        </div>

        <div className="flex items-center justify-between mt-2 gap-4">
          {/* Quantity controls */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2 md:gap-8 lg:gap-6 border border-darkRed/20 rounded-full px-3 md:px-4 lg:px-6 py-1 md:py-2 lg:py-3 bg-darkRed/5"
          >
            <button
              disabled={busy || quantity <= 1}
              onClick={() => onUpdate(id, quantity - 1)}
              className="w-5 h-5 flex items-center justify-center text-darkRed/70 hover:text-darkRed transition-colors disabled:opacity-30 cursor-pointer"
              aria-label="Decrease quantity"
            >
              <svg viewBox="0 0 16 2" fill="currentColor" className="w-3 h-3 md:w-6 md:h-6 lg:h-16 lg:w-16">
                <rect width="16" height="2" rx="1" />
              </svg>
            </button>
            <span className="text-sm md:text-3xl lg:text-2xl font-light tracking-widest text-darkRed min-w-[1.2rem] text-center">
              {quantity}
            </span>
            <button
              disabled={busy || atMaxStock}
              onClick={() => onUpdate(id, quantity + 1)}
              className="w-5 h-5 flex items-center justify-center text-darkRed/70 hover:text-darkRed transition-colors disabled:opacity-30 cursor-pointer"
              aria-label="Increase quantity"
            >
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 md:w-6 md:h-6 lg:h-16 lg:w-16">
                <rect y="7" width="16" height="2" rx="1" />
                <rect x="7" width="2" height="16" rx="1" />
              </svg>
            </button>
          </div>

          {/* Price */}
          <p className={`text-sm md:text-3xl lg:text-2xl tracking-widest transition-colors duration-300 ${selected ? "text-darkRed" : "text-darkRed/35"}`}>
            {formatMoney(
              parseFloat(price.amount) * quantity,
              price.currencyCode
            )}
          </p>
        </div>
      </div>

      {/* Remove */}
      <button
        disabled={busy}
        onClick={(e) => { e.stopPropagation(); onRemove(id); }}
        className="shrink-0 self-start mt-0.5 text-darkRed/30 hover:text-darkRed/70 transition-colors disabled:opacity-20 cursor-pointer"
        aria-label="Remove item"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="w-6 h-6 md:w-12 md:h-12 lg:h-10 lg:w-10"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}

// ─── Main CartSidebar component ───────────────────────────────────────────────

export default function CartSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [busyLines, setBusyLines] = useState(new Set());
  const [selectedLines, setSelectedLines] = useState(new Set());

  const cartRef = useRef(cart);
  useEffect(() => {
    cartRef.current = cart;
  }, [cart]);

  // Ref para rastrear los IDs de línea ya conocidos (evita re-seleccionar ítems desmarcados al actualizar cantidades)
  const knownLineIdsRef = useRef(new Set());

  // ── Sync selected lines cuando el carrito cambia ─────────────────────────

  useEffect(() => {
    const currentLines = cart?.lines?.edges?.map((e) => e.node) ?? [];
    const currentIds = new Set(currentLines.map((l) => l.id));
    // Capturar el snapshot ANTES de actualizar el ref, porque setSelectedLines
    // difiere el updater y el ref ya estaría actualizado cuando React lo ejecute.
    const prevKnownIds = knownLineIdsRef.current;

    setSelectedLines((prev) => {
      const next = new Set(prev);
      // Auto-seleccionar solo ítems genuinamente nuevos (no vistos antes)
      currentLines.forEach((l) => {
        if (!prevKnownIds.has(l.id)) next.add(l.id);
      });
      // Limpiar IDs de ítems que ya no existen en el carrito
      next.forEach((id) => { if (!currentIds.has(id)) next.delete(id); });
      return next;
    });

    // Actualizar el set de IDs conocidos para la próxima comparación
    knownLineIdsRef.current = currentIds;
  }, [cart]);

  const handleToggleSelected = (lineId) => {
    setSelectedLines((prev) => {
      const next = new Set(prev);
      if (next.has(lineId)) next.delete(lineId);
      else next.add(lineId);
      return next;
    });
  };

  // ── Load cart & sync count ────────────────────────────────────────────────

  const syncCart = useCallback(async (newCart) => {
    setCart(newCart);
    dispatchCartUpdated(countItems(newCart));
  }, []);

  const showThankYouToast = useCallback(() => {
    toast.success("Thank you for your order!", {
      position: "bottom-left",
      description: "Your purchase was completed successfully. We'll be in touch soon.",
      duration: 8000,
    });
  }, []);

  const loadCart = useCallback(async () => {
    try {
      // ── Detectar vuelta desde Shopify con ?order=success ──────────────────
      const params = new URLSearchParams(window.location.search);
      if (params.get("order") === "success") {
        // Limpiar el parámetro de la URL sin recargar la página
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, "", cleanUrl);

        // Limpiar carrito y mostrar mensaje
        localStorage.removeItem("cg_cart_id");
        await syncCart(null);
        showThankYouToast();
        return;
      }

      const existing = await getCart();
      await syncCart(existing);
    } catch (_) { }
  }, [syncCart, showThankYouToast]);

  // ── Show toast notification ───────────────────────────────────────────────

  const showNotification = (msg) => {
    toast.success(msg);
  };

  // ── Event listeners ───────────────────────────────────────────────────────

  useEffect(() => {
    loadCart();

    const handleOpen = () => setIsOpen(true);

    const handleAddToCart = async (e) => {
      const { variantId, title, quantityAvailable } = e.detail ?? {};
      if (!variantId) return;

      const currentCart = cartRef.current;
      const existingLine = currentCart?.lines?.edges?.find(
        (edge) => edge.node.merchandise.id === variantId
      );
      const currentQuantity = existingLine ? existingLine.node.quantity : 0;

      // Pre-check: si ya sabemos que se excede el stock, mostramos el toast de inmediato
      if (quantityAvailable != null && currentQuantity >= quantityAvailable) {
        toast.error(
          quantityAvailable === 0 ? "Out of stock" : "Inventory limit reached",
          {
            description:
              quantityAvailable === 0
                ? `${title ?? "This product"} is currently out of stock.`
                : `Only ${quantityAvailable} unit${quantityAvailable === 1 ? "" : "s"} of "${title ?? "this product"}" available. You already have the maximum in your cart.`,
            duration: 4000,
          }
        );
        return;
      }

      setLoading(true);
      setIsOpen(true);
      try {
        const updated = await addToCart(variantId, 1);
        await syncCart(updated);

        // Post-check: Shopify puede cappear la cantidad silenciosamente sin retornar error.
        // Comparamos la cantidad antes y después para detectarlo.
        const updatedLine = updated?.lines?.edges?.find(
          (edge) => edge.node.merchandise.id === variantId
        );
        const newQuantity = updatedLine ? updatedLine.node.quantity : currentQuantity;
        const availableFromCart = updatedLine?.node?.merchandise?.quantityAvailable;

        if (newQuantity <= currentQuantity) {
          toast.error("Inventory limit reached", {
            description:
              availableFromCart != null
                ? `Only ${availableFromCart} unit${availableFromCart === 1 ? "" : "s"} of "${title ?? "this product"}" available. You already have the maximum in your cart.`
                : `"${title ?? "This product"}" has reached the maximum available quantity.`,
            duration: 4000,
          });
        } else {
          showNotification(`${title ?? "Item"} added to cart`);
        }
      } catch (err) {
        console.error("Add to cart failed:", err);
        toast.error("Could not add item", {
          description: "Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    window.addEventListener("cartOpen", handleOpen);
    window.addEventListener("addToCart", handleAddToCart);

    return () => {
      window.removeEventListener("cartOpen", handleOpen);
      window.removeEventListener("addToCart", handleAddToCart);
    };
  }, [loadCart, syncCart]);

  // ── Cart line actions ─────────────────────────────────────────────────────

  const handleUpdate = async (lineId, quantity) => {
    const currentCart = cartRef.current;

    // Capturamos datos actuales del line antes de cualquier cambio
    const lineToUpdate = currentCart?.lines?.edges?.find(
      (edge) => edge.node.id === lineId
    )?.node;
    const currentQuantity = lineToUpdate?.quantity ?? 0;
    const quantityAvailable = lineToUpdate?.merchandise?.quantityAvailable;
    const productTitle = lineToUpdate?.merchandise?.product?.title;

    // Pre-check: si ya sabemos que se excede el stock, toast inmediato
    if (quantityAvailable != null && quantity > quantityAvailable) {
      toast.error("Inventory limit reached", {
        description: `Only ${quantityAvailable} unit${quantityAvailable === 1 ? "" : "s"} of "${productTitle ?? "this product"}" available.`,
        duration: 4000,
      });
      return;
    }

    setBusyLines((prev) => new Set(prev).add(lineId));
    try {
      let updated;
      if (quantity <= 0) {
        updated = await removeCartLine(lineId);
      } else {
        updated = await updateCartLine(lineId, quantity);

        // Post-check: Shopify puede cappear la cantidad silenciosamente.
        // Si la cantidad resultante es menor a la solicitada, informamos al usuario.
        if (updated) {
          const updatedLine = updated.lines?.edges?.find(
            (edge) => edge.node.id === lineId
          )?.node;
          const newQuantity = updatedLine?.quantity ?? currentQuantity;
          const availableFromCart = updatedLine?.merchandise?.quantityAvailable;

          if (newQuantity < quantity) {
            toast.error("Inventory limit reached", {
              description:
                availableFromCart != null
                  ? `Only ${availableFromCart} unit${availableFromCart === 1 ? "" : "s"} of "${productTitle ?? "this product"}" available.`
                  : `"${productTitle ?? "This product"}" has reached the maximum available quantity.`,
              duration: 4000,
            });
          }
        }
      }
      await syncCart(updated);
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setBusyLines((prev) => {
        const next = new Set(prev);
        next.delete(lineId);
        return next;
      });
    }
  };

  const handleRemove = async (lineId) => {
    setBusyLines((prev) => new Set(prev).add(lineId));
    try {
      const updated = await removeCartLine(lineId);
      await syncCart(updated);
    } catch (err) {
      console.error("Remove failed:", err);
    } finally {
      setBusyLines((prev) => {
        const next = new Set(prev);
        next.delete(lineId);
        return next;
      });
    }
  };

  // ── Derived values ────────────────────────────────────────────────────────

  const lines = cart?.lines?.edges?.map((e) => e.node) ?? [];
  const total = cart?.cost?.totalAmount;
  const checkoutUrl = cart?.checkoutUrl;
  const isEmpty = lines.length === 0;

  // Subtotal calculado solo con ítems seleccionados
  const selectedCount = lines.filter((l) => selectedLines.has(l.id)).length;
  const selectedSubtotal = lines
    .filter((l) => selectedLines.has(l.id))
    .reduce((sum, l) => sum + parseFloat(l.merchandise.price.amount) * l.quantity, 0);
  const subtotalCurrency = total?.currencyCode ?? lines[0]?.merchandise?.price?.currencyCode ?? "USD";

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (selectedCount === 0 || !checkoutUrl || loading) return;

    if (selectedCount === lines.length) {
      window.location.href = checkoutUrl;
      return;
    }

    setLoading(true);
    try {
      const unselectedLineIds = lines
        .filter((l) => !selectedLines.has(l.id))
        .map((l) => l.id);

      if (unselectedLineIds.length > 0) {
        const updatedCart = await removeCartLines(unselectedLineIds);
        if (updatedCart && updatedCart.checkoutUrl) {
          window.location.href = updatedCart.checkoutUrl;
          return;
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to prepare checkout", { description: "Please try again." });
    } finally {
      setLoading(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Backdrop ── */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 z-[700] bg-black/30 backdrop-blur-[2px] transition-opacity duration-400 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
      />

      {/* ── Toaster ── */}
      <Toaster
        position="bottom-left"
        style={{
          "--success-bg": "#fde8e6",
          "--success-border": "#68150A",
          "--success-text": "#68150A",
          "--error-bg": "#68150A",
          "--error-border": "#4a0d07",
          "--error-text": "#ffffff",
        }}
      />

      {/* ── Sidebar panel ── */}
      <div
        className={`fixed top-0 right-0 h-full w-full md-custom:w-4/5 md:max-w-1/2 md:min-w-1/3 xl:min-w-1/4 lg:w-1/4 z-800 flex flex-col bg-bone shadow-2xl transition-transform duration-500 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Header   */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-darkRed/10">
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-xl md:text-5xl lg:text-3xl tracking-[0.2em] uppercase text-darkRed">
              Your Cart
            </h2>
            {lines.length > 0 && (
              <span className="text-xs md:text-2xl lg:text-xl tracking-widest text-darkRed/50 uppercase">
                ({lines.length} {lines.length === 1 ? "item" : "items"})
              </span>
            )}
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-darkRed/40 hover:text-darkRed transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              className="w-8 aspect-square md:w-16 md:h-16 lg:w-14 lg:h-14"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 6L6 18M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Cart body */}
        <div className="flex-1 overflow-y-auto px-6 py-2 scrollbar-none">
          {loading && isEmpty ? (
            // Loading skeleton
            <div className="flex flex-col items-center justify-center h-40 gap-3">
              <Spinner />
              <p className="text-xs tracking-widest uppercase text-darkRed/40">
                Updating…
              </p>
            </div>
          ) : isEmpty ? (
            // Empty state
            <div className="flex flex-col items-center justify-center h-full py-20 gap-6">
              <svg
                viewBox="0 0 48 48"
                fill="none"
                stroke="#68150A"
                strokeWidth="1"
                className="w-14 h-14 md:w-28 md:h-28 lg:w-20 lg:h-20 opacity-20"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 6h4l3 20h22l4-14H14"
                />
                <circle cx="19" cy="41" r="2" />
                <circle cx="33" cy="41" r="2" />
              </svg>
              <p className="text-sm md:text-2xl lg:text-3xl tracking-[0.2em] uppercase text-darkRed/40 text-center">
                Your cart is empty
              </p>
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs md:text-2xl lg:text-2xl tracking-wide  uppercase text-darkRed underline underline-offset-4 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            // Line items
            <div>
              {lines.map((line) => (
                <CartItem
                  key={line.id}
                  line={line}
                  onUpdate={handleUpdate}
                  onRemove={handleRemove}
                  busy={busyLines.has(line.id)}
                  quantityAvailable={line.merchandise?.quantityAvailable}
                  selected={selectedLines.has(line.id)}
                  onToggle={handleToggleSelected}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {!isEmpty && (
          <div className="px-6 py-6 border-t border-darkRed/10 flex flex-col gap-4 md:gap-8 lg:gap-8">
            {/* Subtotal */}
            <div className="flex justify-between items-center">
              <span className="text-base md:text-3xl lg:text-2xl font-semibold font-serif uppercase tracking-widest text-darkRed/80">
                Subtotal
                {selectedCount < lines.length && (
                  <span className="ml-1 text-darkRed/90">
                    ({selectedCount}/{lines.length})
                  </span>
                )}
              </span>
              <span className="text-lg md:text-4xl lg:text-3xl tracking-widest text-darkRed">
                {formatMoney(selectedSubtotal, subtotalCurrency)}
              </span>
            </div>
            <p className="text-xs md:text-2xl lg:text-xl font-light w-2/3 tracking-wider text-darkRed/80 -mt-2">
              Shipping and taxes calculated at checkout
            </p>

            {/* Proceed to Payment */}
            <button
              onClick={handleCheckout}
              disabled={!checkoutUrl || selectedCount === 0 || loading}
              className={`add-to-cart-btn relative inline-flex items-center justify-center rounded-full transition-all duration-300 active:scale-95 cursor-pointer disabled:opacity-50 
    /* Dimensiones y Padding solicitado */
    h-full w-fit self-center lg:py-5 lg:px-10 py-3 px-4 md:py-4 md:px-8
    /* Colores y Gradientes específicos con !important */
    text-darkRed! bg-linear-to-br! from-darkRed/25! via-darkRed/12! to-darkRed/8!
    /* Animación hover */
    hover:scale-[1.05]
    ${(!checkoutUrl || selectedCount === 0 || loading) ? "opacity-50 pointer-events-none" : "cursor-pointer"}`}
              style={{
                /* Estilos 3D para mantener la coherencia con el efecto cristalino anterior */
                border: "1px solid rgba(255, 255, 255, 0.4)",
                boxShadow: [
                  "0 15px 25px -5px rgba(0, 0, 0, 0.15)",
                  "0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                  "inset 2px 2px 4px rgba(255, 255, 255, 0.3)",
                  "inset -2px -2px 5px rgba(0, 0, 0, 0.05)",
                ].join(", "),
              }}
            >
              {/* Capa de textura de grano para el efecto visual */}
              <span
                className='pointer-events-none absolute inset-0 z-1 opacity-[0.04] mix-blend-overlay rounded-full [background-image:url(&apos;data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noise)"/></svg>&apos;)]'
              ></span>

              <span className="relative z-10 font-light uppercase tracking-widest select-none text-base md:text-4xl lg:text-3xl">
                {selectedCount === 0
                  ? "Select items to checkout"
                  : (loading ? "Preparing items..." : "Proceed to Payment")
                }
              </span>
            </button>

            {/* Continue shopping */}
            <button
              onClick={() => setIsOpen(false)}
              className="text-sm md:text-3xl lg:text-xl tracking-wider text-darkRed/80 md:text-darkRed/40 hover:text-darkRed/70 transition-colors text-center cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
