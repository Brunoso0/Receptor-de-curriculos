import React, { useEffect, useState } from "react";
import {
  AlertCircle,
  Beer,
  Cake,
  CheckCircle,
  Coffee,
  Cookie,
  Edit3,
  GlassWater,
  IceCream,
  Image,
  Layers,
  Package,
  Pizza,
  Plus,
  Soup,
  Trash2,
  Utensils,
  Wine,
  X,
} from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";

const GROUP_ICONS = [
  { name: "Utensils", icon: Utensils },
  { name: "Coffee", icon: Coffee },
  { name: "Pizza", icon: Pizza },
  { name: "IceCream", icon: IceCream },
  { name: "Beer", icon: Beer },
  { name: "GlassWater", icon: GlassWater },
  { name: "Cake", icon: Cake },
  { name: "Soup", icon: Soup },
  { name: "Cookie", icon: Cookie },
  { name: "Wine", icon: Wine },
];

function resolveGroupIcon(groupNome) {
  const normalized = String(groupNome || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  if (normalized.includes("almoc") || normalized.includes("prato")) return Utensils;
  if (normalized.includes("cafe") || normalized.includes("bebida")) return Coffee;
  if (normalized.includes("pizza")) return Pizza;
  if (normalized.includes("sobremesa") || normalized.includes("doce") || normalized.includes("bolo")) return Cake;
  if (normalized.includes("sorvete") || normalized.includes("gelado")) return IceCream;
  if (normalized.includes("cervej") || normalized.includes("chope")) return Beer;
  if (normalized.includes("suco") || normalized.includes("agua") || normalized.includes("refri")) return GlassWater;
  if (normalized.includes("sopa") || normalized.includes("caldo")) return Soup;
  if (normalized.includes("biscoito") || normalized.includes("cookie")) return Cookie;
  if (normalized.includes("vinho")) return Wine;
  return Utensils;
}

function resolveGroupIconName(groupNome) {
  const icon = resolveGroupIcon(groupNome);
  return GROUP_ICONS.find((item) => item.icon === icon)?.name || "Utensils";
}

function GroupModal({ isOpen, editingGroup, isSaving, onClose, onSubmit }) {
  const [nome, setNome] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("Utensils");
  const [status, setStatus] = useState("ativo");
  const [imagemVertical, setImagemVertical] = useState(null);
  const [imagemVerticalPreview, setImagemVerticalPreview] = useState(null);
  const [imagemHorizontal, setImagemHorizontal] = useState(null);
  const [imagemHorizontalPreview, setImagemHorizontalPreview] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setNome(editingGroup?.nome || "");
      setSelectedIcon(editingGroup?.icon || resolveGroupIconName(editingGroup?.nome) || "Utensils");
      setStatus(String(editingGroup?.status || "ativo").toLowerCase() === "inativo" ? "inativo" : "ativo");
      setImagemVertical(null);
      setImagemVerticalPreview(editingGroup?.imagemVertical || null);
      setImagemHorizontal(null);
      setImagemHorizontalPreview(editingGroup?.imagemHorizontal || null);
    }
  }, [isOpen, editingGroup]);

  if (!isOpen) return null;

  function handleImageChange(e, tipo) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (tipo === "vertical") {
      setImagemVertical(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagemVerticalPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagemHorizontal(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagemHorizontalPreview(reader.result);
      reader.readAsDataURL(file);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!nome.trim()) return;
    onSubmit({
      nome: nome.trim(),
      icon: selectedIcon,
      status,
      imagemVertical,
      imagemHorizontal,
    });
  }

  const SelectedIconComponent = GROUP_ICONS.find((i) => i.name === selectedIcon)?.icon || Utensils;

  return (
    <div className="cardapio-admin-modal-overlay" onClick={isSaving ? undefined : onClose}>
      <div className="cardapio-admin-modal cardapio-admin-group-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cardapio-admin-modal-header">
          <div className="cardapio-admin-modal-header-info">
            <div className="cardapio-admin-modal-header-icon">
              <SelectedIconComponent size={22} strokeWidth={1.8} />
            </div>
            <div>
              <h2>{editingGroup ? "Editar Grupo" : "Novo Grupo"}</h2>
              <p>Configure as preferências da categoria.</p>
            </div>
          </div>
          <button
            type="button"
            className="cardapio-admin-modal-close"
            onClick={onClose}
            disabled={isSaving}
            aria-label="Fechar"
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        <form className="cardapio-admin-modal-body cardapio-admin-modal-form" onSubmit={handleSubmit}>
          <div className="cardapio-admin-modal-field">
            <label className="cardapio-admin-modal-field-label">Nome do Grupo</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Pizzas Artesanais..."
              required
              autoFocus
            />
          </div>

          <div className="cardapio-admin-modal-field">
            <label className="cardapio-admin-modal-field-label">Ícone Representativo</label>
            <div className="cardapio-admin-group-icon-grid">
              {GROUP_ICONS.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  className={`cardapio-admin-group-icon-btn${selectedIcon === item.name ? " selected" : ""}`}
                  onClick={() => setSelectedIcon(item.name)}
                >
                  <item.icon size={24} strokeWidth={selectedIcon === item.name ? 2.5 : 2} />
                </button>
              ))}
            </div>
          </div>

          <div className="cardapio-admin-modal-field">
            <label className="cardapio-admin-modal-field-label">Imagem - Capa Vertical</label>
            <div className="cardapio-admin-image-upload-area">
              <input
                id="imagem-vertical-input"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, "vertical")}
                disabled={isSaving}
                style={{ display: "none" }}
              />
              {imagemVerticalPreview ? (
                <div className="cardapio-admin-image-preview">
                  <img src={imagemVerticalPreview} alt="Vertical" />
                  <button
                    type="button"
                    className="cardapio-admin-image-remove"
                    onClick={() => {
                      setImagemVertical(null);
                      setImagemVerticalPreview(null);
                      document.getElementById("imagem-vertical-input").value = "";
                    }}
                    title="Remover imagem"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label htmlFor="imagem-vertical-input" className="cardapio-admin-upload-label">
                  <Image size={24} />
                  <span>Clique para enviar capa vertical</span>
                </label>
              )}
            </div>
          </div>

          <div className="cardapio-admin-modal-field">
            <label className="cardapio-admin-modal-field-label">Imagem - Capa Horizontal</label>
            <div className="cardapio-admin-image-upload-area">
              <input
                id="imagem-horizontal-input"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, "horizontal")}
                disabled={isSaving}
                style={{ display: "none" }}
              />
              {imagemHorizontalPreview ? (
                <div className="cardapio-admin-image-preview">
                  <img src={imagemHorizontalPreview} alt="Horizontal" />
                  <button
                    type="button"
                    className="cardapio-admin-image-remove"
                    onClick={() => {
                      setImagemHorizontal(null);
                      setImagemHorizontalPreview(null);
                      document.getElementById("imagem-horizontal-input").value = "";
                    }}
                    title="Remover imagem"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <label htmlFor="imagem-horizontal-input" className="cardapio-admin-upload-label">
                  <Image size={24} />
                  <span>Clique para enviar capa horizontal</span>
                </label>
              )}
            </div>
          </div>

          <div className="cardapio-admin-modal-field">
            <label className="cardapio-admin-modal-field-label">Exibição no Cardápio</label>
            <div className="cardapio-admin-status-toggle">
              <button
                type="button"
                className={`cardapio-admin-status-btn ativo${status === "ativo" ? " active" : ""}`}
                onClick={() => setStatus("ativo")}
              >
                <CheckCircle size={18} strokeWidth={2} />
                Ativo
              </button>
              <button
                type="button"
                className={`cardapio-admin-status-btn inativo${status === "inativo" ? " active" : ""}`}
                onClick={() => setStatus("inativo")}
              >
                <AlertCircle size={18} strokeWidth={2} />
                Inativo
              </button>
            </div>
          </div>

          <footer className="cardapio-admin-modal-foot">
            <button type="button" className="ghost" onClick={onClose} disabled={isSaving}>
              Cancelar
            </button>
            <button type="submit" className="primary" disabled={isSaving}>
              {isSaving ? "Salvando..." : editingGroup ? "Salvar Alterações" : "Criar Grupo"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}

function CardapioAdminGroupsPage() {
  const { groups, onCreateGroup, onUpdateGroup, onDeleteGroup } = useOutletContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  function openCreateModal() {
    setEditingGroup(null);
    setIsModalOpen(true);
  }

  function openEditModal(group) {
    setEditingGroup(group);
    setIsModalOpen(true);
  }

  function closeModal() {
    if (isSaving) return;
    setIsModalOpen(false);
  }

  async function handleSubmit(payload) {
    setIsSaving(true);
    try {
      const success = editingGroup
        ? await onUpdateGroup(editingGroup.id, payload)
        : await onCreateGroup(payload);
      if (success) {
        setIsModalOpen(false);
        toast.success(editingGroup ? "Grupo atualizado com sucesso!" : "Grupo criado com sucesso!");
      } else {
        toast.error("Erro ao salvar o grupo. Tente novamente.");
      }
    } catch (error) {
      toast.error(`Erro: ${error.message || "Não foi possível salvar o grupo."}`);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(group) {
    if (!window.confirm(`Deseja excluir o grupo "${group.nome}"? Esta ação não pode ser desfeita.`)) return;
    try {
      const success = await onDeleteGroup(group.id);
      if (success) {
        toast.success("Grupo excluído com sucesso!");
      } else {
        toast.error("Erro ao excluir o grupo. Tente novamente.");
      }
    } catch (error) {
      toast.error(`Erro: ${error.message || "Não foi possível excluir o grupo."}`);
    }
  }

  return (
    <>
      <div className="cardapio-admin-v2-home">
        <header className="cardapio-admin-v2-header">
          <div>
            <h1>Gestão de Grupos</h1>
            <p>Gerencie categorias e a ordem do cardápio.</p>
          </div>
          <button
            type="button"
            className="cardapio-admin-v2-create"
            onClick={openCreateModal}
          >
            <Plus size={18} />
            Criar Novo Grupo
          </button>
        </header>

        <div className="cardapio-admin-groups-table-wrap">
          <table className="cardapio-admin-groups-table">
            <thead>
              <tr>
                <th>Grupo</th>
                <th>Produtos</th>
                <th>Status</th>
                <th className="align-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((group) => {
                const GroupIcon = (group.icon ? GROUP_ICONS.find((i) => i.name === group.icon)?.icon : null) || resolveGroupIcon(group.nome);
                const isActive = String(group.status || "ativo").toLowerCase() !== "inativo";
                return (
                  <tr key={group.id}>
                    <td>
                      <div className="cardapio-admin-group-row-meta">
                        <div className="cardapio-admin-group-row-icon">
                          <GroupIcon size={22} />
                        </div>
                        <div>
                          <strong>{group.nome}</strong>
                          <span>ID: {group.id}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="cardapio-admin-group-row-count">
                        <Package size={14} />
                        {group.count ?? group.totalProdutos ?? 0} itens
                      </div>
                    </td>
                    <td>
                      <span className={`cardapio-admin-group-status-pill ${isActive ? "ativo" : "inativo"}`}>
                        <span className="dot" />
                        {isActive ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="align-right">
                      <div className="cardapio-admin-group-row-actions">
                        <button
                          type="button"
                          className="edit"
                          onClick={() => openEditModal(group)}
                          title="Editar grupo"
                        >
                          <Edit3 size={17} />
                        </button>
                        <button
                          type="button"
                          className="delete"
                          onClick={() => handleDelete(group)}
                          title="Excluir grupo"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {groups.length === 0 && (
            <div className="cardapio-empty-state">
              <Layers size={40} />
              <h3>Nenhum grupo cadastrado</h3>
              <p>Crie um grupo para começar a organizar os produtos.</p>
            </div>
          )}
        </div>
      </div>

      <GroupModal
        isOpen={isModalOpen}
        editingGroup={editingGroup}
        isSaving={isSaving}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </>
  );
}

export default CardapioAdminGroupsPage;