document.addEventListener("alpine:init", () => {
  Alpine.data("checklistApp", function () {
    return {
      items: this.$persist([
        // Peralatan Perlu Dibawa
        { id: 1, category: "dibawa", name: "Kompor seribu mata", qty: "1", checked: false },
        { id: 2, category: "dibawa", name: "Dandang nasi besar", qty: "2", checked: false },
        { id: 3, category: "dibawa", name: "Termos nasi besar", qty: "1", checked: false },
        { id: 4, category: "dibawa", name: "Wajan besar", qty: "1", checked: false },
        { id: 5, category: "dibawa", name: "Wajan sedang", qty: "2", checked: false },
        { id: 6, category: "dibawa", name: "Talenan", qty: "2", checked: false },
        { id: 7, category: "dibawa", name: "Pisau", qty: "4", checked: false },
        { id: 8, category: "dibawa", name: "Sutil besar", qty: "1", checked: false },
        { id: 9, category: "dibawa", name: "Sutil kecil", qty: "1", checked: false },
        { id: 10, category: "dibawa", name: "Saringan kecil", qty: "1", checked: false },
        { id: 11, category: "dibawa", name: "Saringan besar", qty: "1", checked: false },
        { id: 12, category: "dibawa", name: "Tabung gas", qty: "2", checked: false },
        { id: 13, category: "dibawa", name: "Piring rotan", qty: "100 pcs", checked: false },
        { id: 14, category: "dibawa", name: "Centong nasi", qty: "2", checked: false },
        { id: 15, category: "dibawa", name: "Galon", qty: "", checked: false },
        { id: 16, category: "dibawa", name: "Baskom besar", qty: "2", checked: false },
        { id: 17, category: "dibawa", name: "Baskom sedang", qty: "2", checked: false },

        // Peralatan Perlu Dibeli
        { id: 18, category: "dibeli", name: "Tissu", qty: "", checked: false },
        { id: 19, category: "dibeli", name: "Trashbag", qty: "", checked: false },
        { id: 20, category: "dibeli", name: "Sandal", qty: "", checked: false },
        { id: 21, category: "dibeli", name: "Kertas nasi", qty: "", checked: false },
        { id: 22, category: "dibeli", name: "Cup kopi", qty: "", checked: false },
        { id: 23, category: "dibeli", name: "Bola warna", qty: "", checked: false },
        { id: 24, category: "dibeli", name: "Balon", qty: "", checked: false },
        { id: 25, category: "dibeli", name: "Tusuk gigi", qty: "", checked: false },

        // Perlengkapan Acara
        { id: 26, category: "acara", name: "Infocus", qty: "", checked: false },
        { id: 27, category: "acara", name: "Kabel roll", qty: "", checked: false },
        { id: 28, category: "acara", name: "Sound system + mic", qty: "", checked: false },
        { id: 29, category: "acara", name: "Karpet", qty: "", checked: false },
        { id: 30, category: "acara", name: "Terpal", qty: "", checked: false },
        { id: 31, category: "acara", name: "Tali rapia", qty: "", checked: false },
        { id: 32, category: "acara", name: "Papan kamar mandi", qty: "", checked: false },
        { id: 33, category: "acara", name: "Sarung", qty: "6", checked: false },
      ]).as("ceklis_items_kb_v3"),

      categories: {
        dibawa: { title: "Peralatan Yang Perlu Dibawa", icon: "fa-truck-ramp-box" },
        dibeli: { title: "Peralatan Yang Perlu Dibeli", icon: "fa-cart-shopping" },
        acara: { title: "Perlengkapan Acara", icon: "fa-champagne-glasses" },
      },

      searchQuery: "",
      filterStatus: "all",
      isModalOpen: false,
      hasCelebrated: false,
      newItem: { category: "dibawa", name: "", qty: "" },
      toast: { show: false, message: "" },

      get totalCount() {
        return this.items.length;
      },
      get completedCount() {
        return this.items.filter((i) => i.checked).length;
      },
      get pendingCount() {
        return this.totalCount - this.completedCount;
      },
      get progressPercent() {
        return this.totalCount === 0
          ? 0
          : Math.round((this.completedCount / this.totalCount) * 100);
      },

      initApp() {
        this.$watch("completedCount", (val) => {
          if (val > 0 && val === this.totalCount && !this.hasCelebrated) {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            this.hasCelebrated = true;
            this.showToast("Selamat! Semua perlengkapan sudah lengkap! 🎉");
          } else if (val < this.totalCount) {
            this.hasCelebrated = false;
          }
        });
      },

      getFilteredItemsByCategory(categoryKey) {
        return this.items.filter((item) => {
          const matchCategory = item.category === categoryKey;
          const matchSearch = item.name.toLowerCase().includes(this.searchQuery.toLowerCase());
          const matchFilter =
            this.filterStatus === "all" ||
            (this.filterStatus === "pending" && !item.checked) ||
            (this.filterStatus === "completed" && item.checked);
          return matchCategory && matchSearch && matchFilter;
        });
      },

      getCategoryProgressText(catKey) {
        const inCat = this.items.filter((i) => i.category === catKey);
        const doneInCat = inCat.filter((i) => i.checked).length;
        return `${doneInCat} dari ${inCat.length} barang selesai`;
      },

      toggleItem(id) {
        const target = this.items.find((i) => i.id === id);
        if (target) {
          target.checked = !target.checked;
        }
      },

      deleteItem(id) {
        const target = this.items.find((i) => i.id === id);
        const name = target ? target.name : "";

        Swal.fire({
          title: "Hapus Barang?",
          text: `Apakah Anda yakin ingin menghapus "${name}"?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#ef4444",
          cancelButtonColor: "#94a3b8",
          confirmButtonText: "Ya, Hapus",
          cancelButtonText: "Batal",
          customClass: {
            popup: "rounded-2xl font-sans",
            confirmButton: "px-4 py-2 rounded-xl font-bold text-xs",
            cancelButton: "px-4 py-2 rounded-xl font-bold text-xs",
          },
        }).then((result) => {
          if (result.isConfirmed) {
            this.items = this.items.filter((i) => i.id !== id);
            this.showToast(`"${name}" berhasil dihapus.`);
          }
        });
      },

      resetAll() {
        Swal.fire({
          title: "Reset Ceklis?",
          text: "Semua status barang akan dikembalikan ke awal.",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#00AEEF",
          cancelButtonColor: "#94a3b8",
          confirmButtonText: "Ya, Reset",
          cancelButtonText: "Batal",
          customClass: {
            popup: "rounded-2xl font-sans",
            confirmButton: "px-4 py-2 rounded-xl font-bold text-xs text-white",
            cancelButton: "px-4 py-2 rounded-xl font-bold text-xs",
          },
        }).then((result) => {
          if (result.isConfirmed) {
            this.items.forEach((i) => (i.checked = false));
            this.showToast("Semua ceklis berhasil di-reset.");
          }
        });
      },

      addItem() {
        if (!this.newItem.name.trim()) return;

        const newId = this.items.length > 0 ? Math.max(...this.items.map((i) => i.id)) + 1 : 1;
        this.items.push({
          id: newId,
          category: this.newItem.category,
          name: this.newItem.name.trim(),
          qty: this.newItem.qty.trim(),
          checked: false,
        });

        this.showToast(`"${this.newItem.name.trim()}" ditambahkan.`);
        this.closeModal();
      },

      closeModal() {
        this.isModalOpen = false;
        this.newItem = { category: "dibawa", name: "", qty: "" };
      },

      showToast(msg) {
        this.toast.message = msg;
        this.toast.show = true;
        setTimeout(() => {
          this.toast.show = false;
        }, 3000);
      },
    };
  });
});
