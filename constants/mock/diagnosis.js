export const DIAGNOSIS_DETAIL_DATA = {
  title: 'Viêm dạ dày cấp tính',
  icdCode: 'Mã ICD-10: K29.0',
  accuracy: '92%',
  symptoms: [
    { 
      title: 'Đau thượng vị', 
      level: 'Cao', 
      levelColor: '#EF4444', 
      description: 'Đau quặn từng cơn, tăng lên sau khi ăn hoặc uống bia rượu.' 
    },
    { 
      title: 'Buồn nôn & Nôn mửa', 
      level: 'Trung bình', 
      levelColor: '#3B82F6', 
      description: 'Cảm giác buồn nôn liên tục, nôn ra thức ăn có dịch chua.' 
    }
  ],
  recommendations: [
    { type: 'file', text: 'Chỉ định nội soi dạ dày tá tràng để đánh giá mức độ tổn thương niêm mạc.' },
    { type: 'activity', text: 'Bắt đầu phác đồ điều trị giảm tiết axit (PPI) đường tĩnh mạch nếu nôn nhiều.' },
    { type: 'user', text: 'Gặp bác sĩ chuyên khoa tiêu hóa để hội chẩn.' }
  ],
  differential: [
    { name: 'Loét dạ dày tá tràng', value: '24%' },
    { name: 'Trào ngược DD-TQ (GERD)', value: '15%' },
    { name: 'Viêm tụy cấp', value: '5%' }
  ]
};
