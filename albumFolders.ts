// albumFolders.ts - Cấu hình mapping slug → folderId cho các album
export const albumFolders: Record<string, string> = {
  totnghiep: "1ekwV4Em3hYYJd2poJrrRXON9Q9F5pTQ6",
  nangtho: "1NF0pDrNcoEaZY-L72jTjjvRBAYKOBB-M",
  couple: "1Gu7coU0blGlPoOKD5rhBNIbX0geBctfM",
  sinhnhat: "1rav3R14nehNpkvehpUm4auFmnqSbjyk0",
  noel: "1PMRxP8sCDS6KhMNEeLJfP6suUewC5l-a",
  tet: "1IUc0QjYfKOMZozkxvdV_XlXZEJuVkzUj",
  ledoclap: "1KoXO6GMLRTzkngIJ9inrKyZgRAwF6RYz",
  anhcuoi: "1lN1z0NXvzymlRpmQu58wJy5-l-V1ulJu",
  studio: "1tnsPA_M5s15owfJ1H2q8FVS9kz7pMrpE",
  trungthu: "1x8n1krrUjgUqKkpb6Kf6jAJ_sFMzETNV"
};

// Tiêu đề tương ứng với từng album
export const albumTitles: Record<string, string> = {
  totnghiep: "Kỷ Yếu Tốt Nghiệp 🎓",
  nangtho: "Nàng Thơ 🌸",
  couple: "Couple 💑",
  sinhnhat: "Sinh nhật 🎈🎂",
  noel: "Giáng sinh 🎄",
  tet: "Tết 🎆",
  ledoclap: "Lễ độc lập 🎉",
  anhcuoi: "💍 Our Wedding Day",
  studio: "📸 Album Studio",
  trungthu: "Trung Thu 🏮"
};

// Kiểm tra slug có hợp lệ không
export const isValidAlbumSlug = (slug: string): boolean => {
  return slug in albumFolders;
};

// Lấy folder ID từ slug
export const getFolderId = (slug: string): string | null => {
  return albumFolders[slug] || null;
};

// Lấy title từ slug
export const getAlbumTitle = (slug: string): string => {
  return albumTitles[slug] || "Bộ Sưu Tập Ảnh 📸";
};