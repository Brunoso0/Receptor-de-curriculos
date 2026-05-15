import React from "react";
import {
  Beer,
  Cake,
  ChevronLeft,
  ChevronRight,
  Clock,
  Coffee,
  Cookie,
  GlassWater,
  Grid2x2,
  IceCream,
  LayoutDashboard,
  LogOut,
  Pizza,
  ShoppingBag,
  Soup,
  Star,
  Utensils,
  Wine,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

function getIconComponent(iconName) {
  const iconMap = {
    "Utensils": Utensils,
    "Coffee": Coffee,
    "Pizza": Pizza,
    "IceCream": IceCream,
    "Beer": Beer,
    "GlassWater": GlassWater,
    "Cake": Cake,
    "Soup": Soup,
    "Cookie": Cookie,
    "Wine": Wine,
  };
  return iconMap[iconName] || Utensils;
}

function CardapioSidebar({
  groups,
  selectedGroupId,
  onSelectGroup,
  session,
  variant,
  isExpanded,
  onToggleExpand,
  onLogout,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarExpanded = Boolean(isExpanded);

  if (variant === "admin") {
    const isDashboardActive = location.pathname === "/menu/admin";
    const isGroupsActive = location.pathname.includes("/menu/admin/grupos");
    const isHoursActive = location.pathname.includes("/menu/admin/horarios");
    const shortcuts = groups;
    const initials = (session?.nome || "BS")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((namePart) => namePart.charAt(0).toUpperCase())
      .join("");

    return (
      <aside className={`cardapio-admin-sidebar-v2 ${sidebarExpanded ? "expanded" : "collapsed"}`}>
        <div className="cardapio-admin-sidebar-brand">
          <div className="cardapio-admin-sidebar-brand-icon">
            <Coffee size={20} />
          </div>
          {sidebarExpanded ? <strong>JR COFFEE</strong> : null}
        </div>

        <button type="button" className="cardapio-admin-sidebar-toggle" onClick={onToggleExpand}>
          {sidebarExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>

        <nav className="cardapio-admin-sidebar-nav">
          <small>{sidebarExpanded ? "Principal" : "•••"}</small>

          <button
            type="button"
            className={`cardapio-admin-side-link ${isDashboardActive ? "active" : ""}`}
            onClick={() => {
              onSelectGroup("all");
              navigate("/menu/admin");
            }}
            title="Dashboard"
          >
            <LayoutDashboard size={18} />
            {sidebarExpanded ? <span>Painel</span> : null}
          </button>

          <button
            type="button"
            className={`cardapio-admin-side-link ${isGroupsActive ? "active" : ""}`}
            onClick={() => navigate("/menu/admin/grupos")}
            title="Grupos"
          >
            <Grid2x2 size={18} />
            {sidebarExpanded ? <span>Grupos</span> : null}
          </button>

          <button
            type="button"
            className={`cardapio-admin-side-link ${isHoursActive ? "active" : ""}`}
            onClick={() => navigate("/menu/admin/horarios")}
            title="Horários"
          >
            <Clock size={18} />
            {sidebarExpanded ? <span>Horários</span> : null}
          </button>

          <small>{sidebarExpanded ? "Atalhos" : "•••"}</small>

          {shortcuts.map((group, index) => {
            const ShortcutIcon = group.icon ? getIconComponent(group.icon) : (index % 2 === 0 ? Utensils : Coffee);
            const isActive = String(selectedGroupId) === String(group.id);

            return (
              <button
                key={group.id}
                type="button"
                className={`cardapio-admin-side-link ${isActive ? "active" : ""}`}
                onClick={() => {
                  onSelectGroup(group.id);
                  navigate("/menu/admin");
                }}
                title={group.nome}
              >
                <ShortcutIcon size={18} />
                {sidebarExpanded ? <span>{group.nome}</span> : null}
              </button>
            );
          })}
        </nav>

        <div className="cardapio-admin-sidebar-footer">
          <div className="cardapio-admin-side-profile">
            <div className="cardapio-admin-side-avatar">{initials || "BS"}</div>
            {sidebarExpanded ? (
              <div>
                <strong>{session?.nome || "Administrador"}</strong>
                <small>ADMIN</small>
              </div>
            ) : null}
          </div>

          <button type="button" className="cardapio-admin-side-logout" onClick={onLogout} title="Sair">
            <LogOut size={18} />
            {sidebarExpanded ? <span>Sair</span> : null}
          </button>
        </div>
      </aside>
    );
  }

  const isHighlightsActive = selectedGroupId === "novidades";
  const isAllGroupsActive = selectedGroupId === "all";
  const isProductsActive = location.pathname === "/menu/produtos";

  return (
    <aside className={`cardapio-admin-sidebar-v2 ${sidebarExpanded ? "expanded" : "collapsed"}`}>
      <div className="cardapio-admin-sidebar-brand">
        <div className="cardapio-admin-sidebar-brand-icon">
          <Coffee size={20} />
        </div>
        {sidebarExpanded ? <strong>JR COFFEE</strong> : null}
      </div>

      <button type="button" className="cardapio-admin-sidebar-toggle" onClick={onToggleExpand}>
        {sidebarExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      <div className="cardapio-admin-sidebar-body">
        <nav className="cardapio-admin-sidebar-nav">
          <small>{sidebarExpanded ? "Principal" : "•••"}</small>

          <button
            type="button"
            className={`cardapio-admin-side-link ${isHighlightsActive ? "active" : ""}`}
            onClick={() => onSelectGroup("novidades")}
            title="Novidades"
          >
            <Star size={18} />
            {sidebarExpanded ? <span>Novidades</span> : null}
          </button>

          <button
            type="button"
            className={`cardapio-admin-side-link ${isAllGroupsActive ? "active" : ""}`}
            onClick={() => onSelectGroup("all")}
            title="Grupos"
          >
            <Grid2x2 size={18} />
            {sidebarExpanded ? <span>Grupos</span> : null}
          </button>

          <button
            type="button"
            className={`cardapio-admin-side-link ${isProductsActive ? "active" : ""}`}
            onClick={() => onSelectGroup("products")}
            title="Produtos"
          >
            <ShoppingBag size={18} />
            {sidebarExpanded ? <span>Produtos</span> : null}
          </button>
        </nav>

        <section className="cardapio-admin-sidebar-groups-section" aria-label="Categorias disponíveis">
          <small className="cardapio-admin-sidebar-section-label">{sidebarExpanded ? "Categorias" : "•••"}</small>

          <div className="cardapio-admin-sidebar-groups-scroll">
            {groups.map((group) => {
              const GroupIcon = group.icon ? getIconComponent(group.icon) : Utensils;
              return (
                <button
                  key={group.id}
                  type="button"
                  className={`cardapio-admin-side-link ${String(selectedGroupId) === String(group.id) ? "active" : ""}`}
                  onClick={() => onSelectGroup(group.id)}
                  title={group.nome}
                >
                  <GroupIcon size={18} />
                  {sidebarExpanded ? <span>{group.nome}</span> : null}
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <div className="cardapio-admin-sidebar-footer">
        <div className="cardapio-admin-side-profile">
          <div className="cardapio-admin-side-avatar">CD</div>
          {sidebarExpanded ? (
            <div>
              <strong>Cardápio Digital</strong>
              <small>USUÁRIO</small>
            </div>
          ) : null}
        </div>

        <button type="button" className="cardapio-admin-side-logout" onClick={() => navigate("/menu/login")} title="Acesso gestor">
          <LayoutDashboard size={18} />
          {sidebarExpanded ? <span>Acesso gestor</span> : null}
        </button>
      </div>
    </aside>
  );
}

export default CardapioSidebar;