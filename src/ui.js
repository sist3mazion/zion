'use strict';
/**
 * Textos de la interfaz.
 *   c = portada (bloc de notas). Va EN CLARO en el archivo: solo palabras de una app de notas.
 *   r = lector. Va DENTRO del contenido cifrado: no se ve sin la clave.
 *
 * Ninguno ha pasado todavía por un hablante nativo. es y en son fiables; el resto son frases
 * cortas traducidas por IA y están PENDIENTES de revisión nativa antes de repartir nada.
 * Para añadir un idioma, copia el bloque "en" (o pásalo con --ui-archivo mi_idioma.json).
 */
module.exports = {
  es: {
    nm: 'Español',
    dir: 'ltr',
    c: { t: 'Notas', s: 'Buscar', e: 'No hay notas', z: 'Sin resultados', n: 'Nueva nota', d: 'Eliminar', b: 'Atrás', p: 'Escribe aquí…', f: 'notas' },
    r: {
      bk: 'Atrás', pv: 'Anterior', nx: 'Siguiente', f: 'Tamaño de letra', th: 'Tema', cp: 'Pasar una copia', ab: 'Acerca de', x: 'Cerrar', s: 'Buscar', m: 'Más', z: 'Sin resultados',
      k1: 'Clave nueva', k2: 'Repite la clave', fn: 'Nombre del archivo', mk: 'Crear copia', e1: 'Mínimo 16 caracteres', e2: 'Las claves no coinciden',
      h1: 'Crea una copia para otra persona. Llevará su propia clave y será distinta de la tuya. Dile la clave en persona, nunca por mensaje.',
      h2: 'Copia lista. Pásala por Bluetooth, tarjeta o cable.', sd: 'Enviar', sv: 'Guardar', ok: 'Hecho',
      hp: 'Para abrir: escribe la clave en el buscador de notas y pulsa Intro. Para cerrar: ✕, Atrás o cambia de aplicación.',
      lg: 'Idioma', cl: 'Idiomas de la copia', cc: 'Idioma de las notas', e3: 'Elige al menos un idioma'
    }
  },
  en: {
    nm: 'English',
    dir: 'ltr',
    c: { t: 'Notes', s: 'Search', e: 'No notes yet', z: 'No results', n: 'New note', d: 'Delete', b: 'Back', p: 'Write here…', f: 'notes' },
    r: {
      bk: 'Back', pv: 'Previous', nx: 'Next', f: 'Text size', th: 'Theme', cp: 'Pass on a copy', ab: 'About', x: 'Close', s: 'Search', m: 'More', z: 'No results',
      k1: 'New passphrase', k2: 'Repeat the passphrase', fn: 'File name', mk: 'Make copy', e1: 'At least 16 characters', e2: 'The passphrases do not match',
      h1: 'Make a copy for someone else. It gets its own passphrase and is different from yours. Tell them the passphrase in person, never in a message.',
      h2: 'Copy ready. Pass it on by Bluetooth, card or cable.', sd: 'Send', sv: 'Save', ok: 'Done',
      hp: 'To open: type the passphrase in the notes search box and press Enter. To close: ✕, Back, or switch apps.',
      lg: 'Language', cl: 'Languages in the copy', cc: 'Language of the notes', e3: 'Choose at least one language'
    }
  },
  fr: {
    nm: 'Français',
    dir: 'ltr',
    c: { t: 'Notes', s: 'Rechercher', e: 'Aucune note', z: 'Aucun résultat', n: 'Nouvelle note', d: 'Supprimer', b: 'Retour', p: 'Écrivez ici…', f: 'notes' },
    r: {
      bk: 'Retour', pv: 'Précédent', nx: 'Suivant', f: 'Taille du texte', th: 'Thème', cp: 'Donner une copie', ab: 'À propos', x: 'Fermer', s: 'Rechercher', m: 'Plus', z: 'Aucun résultat',
      k1: 'Nouvelle phrase secrète', k2: 'Répétez la phrase secrète', fn: 'Nom du fichier', mk: 'Créer la copie', e1: '16 caractères minimum', e2: 'Les deux phrases ne correspondent pas',
      h1: 'Créez une copie pour quelqu’un d’autre. Elle aura sa propre phrase secrète et sera différente de la vôtre. Donnez la phrase de vive voix, jamais par message.',
      h2: 'Copie prête. Transmettez-la par Bluetooth, carte ou câble.', sd: 'Envoyer', sv: 'Enregistrer', ok: 'Terminé',
      hp: 'Pour ouvrir : tapez la phrase secrète dans la recherche des notes, puis Entrée. Pour fermer : ✕, Retour, ou changez d’application.',
      lg: 'Langue', cl: 'Langues de la copie', cc: 'Langue des notes', e3: 'Choisissez au moins une langue'
    }
  },
  pt: {
    nm: 'Português',
    dir: 'ltr',
    c: { t: 'Notas', s: 'Buscar', e: 'Nenhuma nota', z: 'Nenhum resultado', n: 'Nova nota', d: 'Excluir', b: 'Voltar', p: 'Escreva aqui…', f: 'notas' },
    r: {
      bk: 'Voltar', pv: 'Anterior', nx: 'Próximo', f: 'Tamanho da letra', th: 'Tema', cp: 'Passar uma cópia', ab: 'Sobre', x: 'Fechar', s: 'Buscar', m: 'Mais', z: 'Nenhum resultado',
      k1: 'Nova senha', k2: 'Repita a senha', fn: 'Nome do arquivo', mk: 'Criar cópia', e1: 'Mínimo de 16 caracteres', e2: 'As senhas não coincidem',
      h1: 'Crie uma cópia para outra pessoa. Ela terá a própria senha e será diferente da sua. Diga a senha pessoalmente, nunca por mensagem.',
      h2: 'Cópia pronta. Passe por Bluetooth, cartão ou cabo.', sd: 'Enviar', sv: 'Salvar', ok: 'Concluído',
      hp: 'Para abrir: digite a senha na busca das notas e pressione Enter. Para fechar: ✕, Voltar ou troque de aplicativo.',
      lg: 'Idioma', cl: 'Idiomas da cópia', cc: 'Idioma das notas', e3: 'Escolha pelo menos um idioma'
    }
  },
  ru: {
    nm: 'Русский',
    dir: 'ltr',
    c: { t: 'Заметки', s: 'Поиск', e: 'Заметок нет', z: 'Ничего не найдено', n: 'Новая заметка', d: 'Удалить', b: 'Назад', p: 'Пишите здесь…', f: 'заметки' },
    r: {
      bk: 'Назад', pv: 'Назад', nx: 'Вперёд', f: 'Размер шрифта', th: 'Тема', cp: 'Передать копию', ab: 'О тексте', x: 'Закрыть', s: 'Поиск', m: 'Ещё', z: 'Ничего не найдено',
      k1: 'Новый пароль', k2: 'Повторите пароль', fn: 'Имя файла', mk: 'Создать копию', e1: 'Не менее 16 символов', e2: 'Пароли не совпадают',
      h1: 'Создайте копию для другого человека. У неё будет свой пароль, и она будет отличаться от вашей. Сообщите пароль лично, не в сообщении.',
      h2: 'Копия готова. Передайте её по Bluetooth, на карте памяти или по кабелю.', sd: 'Отправить', sv: 'Сохранить', ok: 'Готово',
      hp: 'Чтобы открыть: введите пароль в поиске по заметкам и нажмите Enter. Чтобы закрыть: ✕, «Назад» или переключитесь на другое приложение.',
      lg: 'Язык', cl: 'Языки в копии', cc: 'Язык заметок', e3: 'Выберите хотя бы один язык'
    }
  },
  ar: {
    nm: 'العربية',
    dir: 'rtl',
    c: { t: 'ملاحظات', s: 'بحث', e: 'لا توجد ملاحظات', z: 'لا توجد نتائج', n: 'ملاحظة جديدة', d: 'حذف', b: 'رجوع', p: 'اكتب هنا…', f: 'ملاحظات' },
    r: {
      bk: 'رجوع', pv: 'السابق', nx: 'التالي', f: 'حجم الخط', th: 'المظهر', cp: 'إعطاء نسخة', ab: 'حول', x: 'إغلاق', s: 'بحث', m: 'المزيد', z: 'لا توجد نتائج',
      k1: 'كلمة سر جديدة', k2: 'أعد كتابة كلمة السر', fn: 'اسم الملف', mk: 'إنشاء النسخة', e1: '١٦ حرفًا على الأقل', e2: 'كلمتا السر غير متطابقتين',
      h1: 'أنشئ نسخة لشخص آخر. ستكون لها كلمة سر خاصة بها وتختلف عن نسختك. أخبره بكلمة السر وجهًا لوجه، لا في رسالة.',
      h2: 'النسخة جاهزة. أعطها عبر البلوتوث أو بطاقة الذاكرة أو الكابل.', sd: 'إرسال', sv: 'حفظ', ok: 'تم',
      hp: 'للفتح: اكتب كلمة السر في خانة البحث في الملاحظات ثم اضغط إدخال. للإغلاق: ✕ أو رجوع أو انتقل إلى تطبيق آخر.',
      lg: 'اللغة', cl: 'لغات النسخة', cc: 'لغة الملاحظات', e3: 'اختر لغة واحدة على الأقل'
    }
  },
  fa: {
    nm: 'فارسی',
    dir: 'rtl',
    c: { t: 'یادداشت‌ها', s: 'جستجو', e: 'یادداشتی وجود ندارد', z: 'نتیجه‌ای پیدا نشد', n: 'یادداشت جدید', d: 'حذف', b: 'بازگشت', p: 'اینجا بنویسید…', f: 'یادداشت' },
    r: {
      bk: 'بازگشت', pv: 'قبلی', nx: 'بعدی', f: 'اندازهٔ قلم', th: 'پوسته', cp: 'دادن یک نسخه', ab: 'درباره', x: 'بستن', s: 'جستجو', m: 'بیشتر', z: 'نتیجه‌ای پیدا نشد',
      k1: 'رمز جدید', k2: 'تکرار رمز', fn: 'نام فایل', mk: 'ساخت نسخه', e1: 'دست‌کم ۱۶ نویسه', e2: 'رمزها یکسان نیستند',
      h1: 'برای شخص دیگری یک نسخه بسازید. آن نسخه رمز خودش را دارد و با نسخهٔ شما فرق می‌کند. رمز را حضوری بگویید، نه در پیام.',
      h2: 'نسخه آماده است. آن را با بلوتوث، کارت حافظه یا کابل بدهید.', sd: 'ارسال', sv: 'ذخیره', ok: 'انجام شد',
      hp: 'برای باز کردن: رمز را در جستجوی یادداشت‌ها بنویسید و Enter را بزنید. برای بستن: ✕، بازگشت، یا به برنامهٔ دیگری بروید.',
      lg: 'زبان', cl: 'زبان‌های نسخه', cc: 'زبان یادداشت‌ها', e3: 'دست‌کم یک زبان انتخاب کنید'
    }
  },
  zh: {
    nm: '中文',
    dir: 'ltr',
    c: { t: '备忘录', s: '搜索', e: '没有备忘录', z: '没有结果', n: '新建', d: '删除', b: '返回', p: '在此输入…', f: '备忘录' },
    r: {
      bk: '返回', pv: '上一章', nx: '下一章', f: '字号', th: '主题', cp: '给别人一份', ab: '关于', x: '关闭', s: '搜索', m: '更多', z: '没有结果',
      k1: '新密码', k2: '再输入一次', fn: '文件名', mk: '生成副本', e1: '至少 16 个字符', e2: '两次输入不一致',
      h1: '为别人生成一份副本。它有自己的密码，和你的这份不同。请当面告诉对方密码，不要用消息发送。',
      h2: '副本已生成。请通过蓝牙、存储卡或数据线传给对方。', sd: '发送', sv: '保存', ok: '完成',
      hp: '打开：在备忘录的搜索框输入密码并按回车。关闭：点 ✕、按返回键，或切换到其他应用。',
      lg: '语言', cl: '副本包含的语言', cc: '笔记的语言', e3: '请至少选择一种语言'
    }
  },
  id: {
    nm: 'Bahasa Indonesia',
    dir: 'ltr',
    c: { t: 'Catatan', s: 'Cari', e: 'Belum ada catatan', z: 'Tidak ada hasil', n: 'Catatan baru', d: 'Hapus', b: 'Kembali', p: 'Tulis di sini…', f: 'catatan' },
    r: {
      bk: 'Kembali', pv: 'Sebelumnya', nx: 'Berikutnya', f: 'Ukuran huruf', th: 'Tema', cp: 'Berikan salinan', ab: 'Tentang', x: 'Tutup', s: 'Cari', m: 'Lainnya', z: 'Tidak ada hasil',
      k1: 'Kata sandi baru', k2: 'Ulangi kata sandi', fn: 'Nama berkas', mk: 'Buat salinan', e1: 'Minimal 16 karakter', e2: 'Kata sandi tidak sama',
      h1: 'Buat salinan untuk orang lain. Salinan itu punya kata sandi sendiri dan berbeda dari milik Anda. Sampaikan kata sandinya secara langsung, jangan lewat pesan.',
      h2: 'Salinan siap. Berikan lewat Bluetooth, kartu memori, atau kabel.', sd: 'Kirim', sv: 'Simpan', ok: 'Selesai',
      hp: 'Untuk membuka: ketik kata sandi di kotak pencarian catatan lalu tekan Enter. Untuk menutup: ✕, Kembali, atau pindah ke aplikasi lain.',
      lg: 'Bahasa', cl: 'Bahasa dalam salinan', cc: 'Bahasa catatan', e3: 'Pilih setidaknya satu bahasa'
    }
  },
  vi: {
    nm: 'Tiếng Việt',
    dir: 'ltr',
    c: { t: 'Ghi chú', s: 'Tìm kiếm', e: 'Chưa có ghi chú', z: 'Không có kết quả', n: 'Ghi chú mới', d: 'Xóa', b: 'Quay lại', p: 'Viết tại đây…', f: 'ghi chú' },
    r: {
      bk: 'Quay lại', pv: 'Trước', nx: 'Tiếp', f: 'Cỡ chữ', th: 'Giao diện', cp: 'Trao một bản sao', ab: 'Giới thiệu', x: 'Đóng', s: 'Tìm kiếm', m: 'Khác', z: 'Không có kết quả',
      k1: 'Mật khẩu mới', k2: 'Nhập lại mật khẩu', fn: 'Tên tệp', mk: 'Tạo bản sao', e1: 'Ít nhất 16 ký tự', e2: 'Hai mật khẩu không khớp',
      h1: 'Tạo một bản sao cho người khác. Bản sao đó có mật khẩu riêng và khác với bản của bạn. Hãy nói mật khẩu trực tiếp, đừng gửi qua tin nhắn.',
      h2: 'Bản sao đã sẵn sàng. Hãy chuyển qua Bluetooth, thẻ nhớ hoặc cáp.', sd: 'Gửi', sv: 'Lưu', ok: 'Xong',
      hp: 'Để mở: nhập mật khẩu vào ô tìm kiếm ghi chú rồi nhấn Enter. Để đóng: ✕, Quay lại, hoặc chuyển sang ứng dụng khác.',
      lg: 'Ngôn ngữ', cl: 'Ngôn ngữ trong bản sao', cc: 'Ngôn ngữ của ghi chú', e3: 'Hãy chọn ít nhất một ngôn ngữ'
    }
  },
  my: {
    nm: 'မြန်မာ',
    dir: 'ltr',
    c: { t: 'မှတ်စုများ', s: 'ရှာဖွေရန်', e: 'မှတ်စု မရှိပါ', z: 'ရလဒ် မတွေ့ပါ', n: 'မှတ်စုအသစ်', d: 'ဖျက်ရန်', b: 'နောက်သို့', p: 'ဤနေရာတွင် ရေးပါ…', f: 'မှတ်စု' },
    r: {
      bk: 'နောက်သို့', pv: 'ယခင်အခန်း', nx: 'နောက်အခန်း', f: 'စာလုံးအရွယ်အစား', th: 'အပြင်အဆင်', cp: 'မိတ္တူတစ်ခု ပေးရန်', ab: 'အကြောင်း', x: 'ပိတ်ရန်', s: 'ရှာဖွေရန်', m: 'နောက်ထပ်', z: 'ရလဒ် မတွေ့ပါ',
      k1: 'စကားဝှက်အသစ်', k2: 'စကားဝှက်ကို ထပ်ရိုက်ပါ', fn: 'ဖိုင်အမည်', mk: 'မိတ္တူ ပြုလုပ်ရန်', e1: 'အနည်းဆုံး စာလုံး ၁၆ လုံး', e2: 'စကားဝှက်နှစ်ခု မတူညီပါ',
      h1: 'အခြားသူတစ်ဦးအတွက် မိတ္တူတစ်ခု ပြုလုပ်ပါ။ ထိုမိတ္တူတွင် ကိုယ်ပိုင်စကားဝှက် ပါရှိပြီး သင့်မိတ္တူနှင့် မတူပါ။ စကားဝှက်ကို မျက်နှာချင်းဆိုင် ပြောပြပါ၊ မက်ဆေ့ချ်ဖြင့် မပို့ပါနှင့်။',
      h2: 'မိတ္တူ အသင့်ဖြစ်ပါပြီ။ Bluetooth၊ မန်မိုရီကတ် သို့မဟုတ် ကြိုးဖြင့် ပေးပါ။', sd: 'ပို့ရန်', sv: 'သိမ်းရန်', ok: 'ပြီးပါပြီ',
      hp: 'ဖွင့်ရန် - မှတ်စုများ၏ ရှာဖွေရေးအကွက်တွင် စကားဝှက်ကို ရိုက်ထည့်ပြီး Enter နှိပ်ပါ။ ပိတ်ရန် - ✕၊ နောက်သို့၊ သို့မဟုတ် အခြားအက်ပ်သို့ ပြောင်းပါ။',
      lg: 'ဘာသာစကား', cl: 'မိတ္တူတွင် ပါမည့် ဘာသာစကားများ', cc: 'မှတ်စုများ၏ ဘာသာစကား', e3: 'ဘာသာစကား အနည်းဆုံး တစ်ခု ရွေးပါ'
    }
  },
  tr: {
    nm: 'Türkçe',
    dir: 'ltr',
    c: { t: 'Notlar', s: 'Ara', e: 'Not yok', z: 'Sonuç yok', n: 'Yeni not', d: 'Sil', b: 'Geri', p: 'Buraya yazın…', f: 'notlar' },
    r: {
      bk: 'Geri', pv: 'Önceki', nx: 'Sonraki', f: 'Yazı boyutu', th: 'Tema', cp: 'Kopya ver', ab: 'Hakkında', x: 'Kapat', s: 'Ara', m: 'Diğer', z: 'Sonuç yok',
      k1: 'Yeni parola', k2: 'Parolayı tekrarlayın', fn: 'Dosya adı', mk: 'Kopya oluştur', e1: 'En az 16 karakter', e2: 'Parolalar eşleşmiyor',
      h1: 'Başka biri için bir kopya oluşturun. Kopyanın kendi parolası olur ve sizinkinden farklıdır. Parolayı yüz yüze söyleyin, mesajla göndermeyin.',
      h2: 'Kopya hazır. Bluetooth, hafıza kartı veya kabloyla verin.', sd: 'Gönder', sv: 'Kaydet', ok: 'Tamam',
      hp: 'Açmak için: parolayı notlardaki arama kutusuna yazıp Enter’a basın. Kapatmak için: ✕, Geri veya başka bir uygulamaya geçin.',
      lg: 'Dil', cl: 'Kopyadaki diller', cc: 'Notların dili', e3: 'En az bir dil seçin'
    }
  },
  hi: {
    nm: 'हिन्दी',
    dir: 'ltr',
    c: { t: 'नोट्स', s: 'खोजें', e: 'कोई नोट नहीं है', z: 'कोई परिणाम नहीं मिला', n: 'नया नोट', d: 'हटाएँ', b: 'वापस', p: 'यहाँ लिखें…', f: 'नोट्स' },
    r: {
      bk: 'वापस', pv: 'पिछला', nx: 'अगला', f: 'अक्षरों का आकार', th: 'थीम', cp: 'एक प्रति दें', ab: 'जानकारी', x: 'बंद करें', s: 'खोजें', m: 'और', z: 'कोई परिणाम नहीं मिला',
      k1: 'नया पासवर्ड', k2: 'पासवर्ड दोबारा लिखें', fn: 'फ़ाइल का नाम', mk: 'प्रति बनाएँ', e1: 'कम से कम 16 अक्षर', e2: 'दोनों पासवर्ड एक जैसे नहीं हैं',
      h1: 'किसी और के लिए एक प्रति बनाएँ। उसका अपना पासवर्ड होगा और वह आपकी प्रति से अलग होगी। पासवर्ड आमने-सामने बताएँ, संदेश में न भेजें।',
      h2: 'प्रति तैयार है। इसे ब्लूटूथ, मेमोरी कार्ड या केबल से दें।', sd: 'भेजें', sv: 'सहेजें', ok: 'हो गया',
      hp: 'खोलने के लिए: नोट्स के खोज बॉक्स में पासवर्ड लिखें और Enter दबाएँ। बंद करने के लिए: ✕, वापस, या किसी दूसरे ऐप पर जाएँ।',
      lg: 'भाषा', cl: 'प्रति में भाषाएँ', cc: 'नोट्स की भाषा', e3: 'कम से कम एक भाषा चुनें'
    }
  },
  ko: {
    nm: '한국어',
    dir: 'ltr',
    c: { t: '메모', s: '검색', e: '메모가 없습니다', z: '결과 없음', n: '새 메모', d: '삭제', b: '뒤로', p: '여기에 입력…', f: '메모' },
    r: {
      bk: '뒤로', pv: '이전', nx: '다음', f: '글자 크기', th: '테마', cp: '사본 전달', ab: '정보', x: '닫기', s: '검색', m: '더보기', z: '결과 없음',
      k1: '새 암호', k2: '암호 다시 입력', fn: '파일 이름', mk: '사본 만들기', e1: '16자 이상 입력하세요', e2: '암호가 일치하지 않습니다',
      h1: '다른 사람에게 줄 사본을 만듭니다. 사본은 자체 암호를 가지며 내 파일과 다릅니다. 암호는 메시지로 보내지 말고 직접 만나서 알려 주세요.',
      h2: '사본이 준비되었습니다. 블루투스, 메모리 카드 또는 케이블로 전달하세요.', sd: '보내기', sv: '저장', ok: '완료',
      hp: '열기: 메모 검색창에 암호를 입력하고 Enter를 누르세요. 닫기: ✕, 뒤로, 또는 다른 앱으로 전환하세요.',
      lg: '언어', cl: '사본에 넣을 언어', cc: '메모 언어', e3: '언어를 하나 이상 선택하세요'
    }
  },
  bn: {
    nm: 'বাংলা',
    dir: 'ltr',
    c: { t: 'নোট', s: 'খুঁজুন', e: 'কোনো নোট নেই', z: 'কোনো ফলাফল নেই', n: 'নতুন নোট', d: 'মুছুন', b: 'পিছনে', p: 'এখানে লিখুন…', f: 'নোট' },
    r: {
      bk: 'পিছনে', pv: 'আগের', nx: 'পরের', f: 'লেখার আকার', th: 'থিম', cp: 'একটি কপি দিন', ab: 'অ্যাপ সম্পর্কে', x: 'বন্ধ করুন', s: 'খুঁজুন', m: 'আরও', z: 'কোনো ফলাফল নেই',
      k1: 'নতুন পাসওয়ার্ড', k2: 'পাসওয়ার্ড আবার লিখুন', fn: 'ফাইলের নাম', mk: 'কপি তৈরি করুন', e1: 'কমপক্ষে 16টি অক্ষর', e2: 'পাসওয়ার্ড দুটি মিলছে না',
      h1: 'অন্য কারও জন্য একটি কপি তৈরি করুন। কপিটির পাসওয়ার্ড আপনার পাসওয়ার্ড থেকে আলাদা হবে। পাসওয়ার্ডটি সেই ব্যক্তিকে সামনাসামনি বলুন, কখনো মেসেজে পাঠাবেন না।',
      h2: 'কপিটি প্রস্তুত। ব্লুটুথ, মেমোরি কার্ড বা কেবলের মাধ্যমে দিন।', sd: 'পাঠান', sv: 'সংরক্ষণ করুন', ok: 'হয়ে গেছে',
      hp: 'খুলতে: নোটের সার্চ বক্সে পাসওয়ার্ড লিখে Enter চাপুন। বন্ধ করতে: ✕, পিছনে, অথবা অন্য অ্যাপে যান।',
      lg: 'ভাষা', cl: 'কপিতে যে ভাষাগুলো থাকবে', cc: 'নোটের ভাষা', e3: 'অন্তত একটি ভাষা বেছে নিন'
    }
  },
  ha: {
    nm: 'Hausa',
    dir: 'ltr',
    c: { t: 'Rubuce-rubuce', s: 'Nema', e: 'Babu rubutu tukuna', z: 'Ba a sami komai ba', n: 'Sabon rubutu', d: 'Goge', b: 'Koma baya', p: 'Rubuta a nan…', f: 'rubuce-rubuce' },
    r: {
      bk: 'Koma baya', pv: 'Na baya', nx: 'Na gaba', f: 'Girman rubutu', th: 'Yanayin nuni', cp: 'Ba da kwafi', ab: 'Game da manhajar', x: 'Rufe', s: 'Nema', m: 'Ƙari', z: 'Ba a sami komai ba',
      k1: 'Sabuwar kalmar sirri', k2: 'Maimaita kalmar sirri', fn: 'Sunan fayil', mk: 'Yi kwafi', e1: 'Aƙalla haruffa 16', e2: 'Kalmomin sirrin ba su yi daidai ba',
      h1: 'Yi kwafi don wani mutum. Kwafin zai sami kalmar sirri ta kansa, wadda ta bambanta da kalmar sirrinka. Ka faɗa wa mutumin kalmar sirrin ido da ido; kada ka taɓa aika ta a saƙo.',
      h2: 'Kwafin ya shirya. Ba da shi ta Bluetooth, katin ma’ajiya ko kebul.', sd: 'Aika', sv: 'Ajiye', ok: 'An gama',
      hp: 'Don buɗewa: rubuta kalmar sirri a akwatin nema na rubuce-rubuce, sannan ka danna Enter. Don rufewa: ✕, Koma baya, ko ka koma wata manhaja.',
      lg: 'Harshe', cl: 'Harsunan da ke cikin kwafin', cc: 'Harshen rubuce-rubuce', e3: 'Zaɓi aƙalla harshe ɗaya'
    }
  },
  ckb: {
    nm: 'کوردی',
    dir: 'rtl',
    c: { t: 'تێبینییەکان', s: 'گەڕان', e: 'هیچ تێبینییەک نییە', z: 'هیچ ئەنجامێک نییە', n: 'تێبینیی نوێ', d: 'سڕینەوە', b: 'گەڕانەوە', p: 'لێرە بنووسە…', f: 'تێبینییەکان' },
    r: {
      bk: 'گەڕانەوە', pv: 'پێشوو', nx: 'دواتر', f: 'قەبارەی نووسین', th: 'ڕووکار', cp: 'دانی کۆپییەک', ab: 'دەربارە', x: 'داخستن', s: 'گەڕان', m: 'زیاتر', z: 'هیچ ئەنجامێک نییە',
      k1: 'وشەی نهێنیی نوێ', k2: 'دووبارە وشەی نهێنی بنووسەوە', fn: 'ناوی فایل', mk: 'دروستکردنی کۆپی', e1: 'لانیکەم 16 کارەکتەر', e2: 'وشە نهێنییەکان وەک یەک نین',
      h1: 'کۆپییەک بۆ کەسێکی تر دروست بکە. وشەی نهێنیی کۆپییەکە جیاواز دەبێت لە وشەی نهێنیی تۆ. وشەی نهێنییەکە ڕووبەڕوو پێی بڵێ، هەرگیز بە پەیام مەینێرە.',
      h2: 'کۆپییەکە ئامادەیە. بە بلووتووس، کارتی بیرگە یان کێبڵ بیدە.', sd: 'ناردن', sv: 'پاشەکەوتکردن', ok: 'تەواو',
      hp: 'بۆ کردنەوە: وشەی نهێنی لە سندووقی گەڕانی تێبینییەکان بنووسە و Enter دابگرە. بۆ داخستن: ✕، گەڕانەوە، یان بڕۆ بۆ ئەپێکی تر.',
      lg: 'زمان', cl: 'زمانەکانی ناو کۆپییەکە', cc: 'زمانی تێبینییەکان', e3: 'لانیکەم یەک زمان هەڵبژێرە'
    }
  },
  ug: {
    nm: 'ئۇيغۇرچە',
    dir: 'rtl',
    c: { t: 'خاتىرە', s: 'ئىزدەش', e: 'خاتىرە يوق', z: 'نەتىجە يوق', n: 'يېڭى خاتىرە', d: 'ئۆچۈرۈش', b: 'قايتىش', p: 'بۇ يەرگە يېزىڭ…', f: 'خاتىرە' },
    r: {
      bk: 'قايتىش', pv: 'ئالدىنقى', nx: 'كېيىنكى', f: 'خەت چوڭلۇقى', th: 'كۆرۈنۈش', cp: 'كۆچۈرمە بېرىش', ab: 'ھەققىدە', x: 'تاقاش', s: 'ئىزدەش', m: 'تېخىمۇ كۆپ', z: 'نەتىجە يوق',
      k1: 'يېڭى پارول', k2: 'پارولنى قايتا كىرگۈزۈڭ', fn: 'ھۆججەت نامى', mk: 'كۆچۈرمە ياساش', e1: 'كەم دېگەندە 16 ھەرپ-بەلگە', e2: 'پاروللار ماس كەلمىدى',
      h1: 'باشقا بىرسى ئۈچۈن كۆچۈرمە ياساڭ. ئۇ كۆچۈرمىنىڭ ئۆزىگە خاس پارولى بولىدۇ، بۇ پارول سىزنىڭ پارولىڭىزدىن پەرقلىق بولىدۇ. پارولنى يۈزمۇيۈز ئېيتىڭ، ھەرگىز ئۇچۇر ئارقىلىق ئەۋەتمەڭ.',
      h2: 'كۆچۈرمە تەييار. ئۇنى Bluetooth، ئەستە ساقلاش كارتىسى ياكى سىم ئارقىلىق بېرىڭ.', sd: 'ئەۋەتىش', sv: 'ساقلاش', ok: 'تامام',
      hp: 'ئېچىش ئۈچۈن: پارولنى خاتىرىلەرنىڭ ئىزدەش رامكىسىغا يېزىپ Enter نى بېسىڭ. تاقاش ئۈچۈن: ✕، قايتىش ياكى باشقا ئەپكە ئۆتۈڭ.',
      lg: 'تىل', cl: 'كۆچۈرمىدىكى تىللار', cc: 'خاتىرىلەرنىڭ تىلى', e3: 'كەم دېگەندە بىر تىل تاللاڭ'
    }
  },
  ur: {
    nm: 'اردو',
    dir: 'rtl',
    c: { t: 'نوٹس', s: 'تلاش', e: 'کوئی نوٹ نہیں', z: 'کوئی نتیجہ نہیں ملا', n: 'نیا نوٹ', d: 'حذف کریں', b: 'واپس', p: 'یہاں لکھیں…', f: 'نوٹس' },
    r: {
      bk: 'واپس', pv: 'پچھلا', nx: 'اگلا', f: 'حروف کا سائز', th: 'تھیم', cp: 'ایک کاپی دیں', ab: 'ایپ کے بارے میں', x: 'بند کریں', s: 'تلاش', m: 'مزید', z: 'کوئی نتیجہ نہیں ملا',
      k1: 'نیا پاس ورڈ', k2: 'پاس ورڈ دوبارہ لکھیں', fn: 'فائل کا نام', mk: 'کاپی بنائیں', e1: 'کم از کم 16 حروف', e2: 'دونوں پاس ورڈ ایک جیسے نہیں ہیں',
      h1: 'کسی اور کے لیے ایک کاپی بنائیں۔ اس کا پاس ورڈ آپ کے پاس ورڈ سے مختلف ہوگا۔ یہ پاس ورڈ اس شخص کو آمنے سامنے بتائیں، کبھی پیغام میں نہ بھیجیں۔',
      h2: 'کاپی تیار ہے۔ اسے بلوٹوتھ، میموری کارڈ یا کیبل سے دیں۔', sd: 'بھیجیں', sv: 'محفوظ کریں', ok: 'ہو گیا',
      hp: 'کھولنے کے لیے: نوٹس کے تلاش کے خانے میں پاس ورڈ لکھیں اور Enter دبائیں۔ بند کرنے کے لیے: ✕، واپس، یا کسی اور ایپ پر جائیں۔',
      lg: 'زبان', cl: 'کاپی میں شامل زبانیں', cc: 'نوٹس کی زبان', e3: 'کم از کم ایک زبان منتخب کریں'
    }
  },
  so: {
    nm: 'Soomaali',
    dir: 'ltr',
    c: { t: 'Qoraallo', s: 'Raadi', e: 'Wax qoraal ah ma jiraan', z: 'Natiijo lama helin', n: 'Qoraal cusub', d: 'Tirtir', b: 'Dib u noqo', p: 'Halkan ku qor…', f: 'qoraallo' },
    r: {
      bk: 'Dib u noqo', pv: 'Hore', nx: 'Xiga', f: 'Cabbirka qoraalka', th: 'Muuqaal', cp: 'Bixi nuqul', ab: 'Ku saabsan app-ka', x: 'Xir', s: 'Raadi', m: 'Ikhtiyaarro dheeraad ah', z: 'Natiijo lama helin',
      k1: 'Eray sir ah oo cusub', k2: 'Ku celi erayga sirta ah', fn: 'Magaca faylka', mk: 'Samee nuqul', e1: 'Ugu yaraan 16 xaraf', e2: 'Erayada sirta ahi isku mid ma aha',
      h1: 'Nuqul u samee qof kale. Nuqulku wuxuu yeelan doonaa eray sir ah oo u gaar ah, kaas oo ka duwanaan doona eraygaaga sirta ah. Erayga sirta ah qofka fool ka fool ugu sheeg; weligaa farriin ha ugu dirin.',
      h2: 'Nuqulku waa diyaar. Ku sii Bluetooth, kaarka xusuusta ama fiilo.', sd: 'Dir', sv: 'Kaydi', ok: 'Waa dhammaatay',
      hp: 'Si aad u furto: erayga sirta ah ku qor sanduuqa raadinta qoraallada oo riix Enter. Si aad u xirto: ✕, Dib u noqo, ama u gudub app kale.',
      lg: 'Luqad', cl: 'Luqadaha ku jira nuqulka', cc: 'Luqadda qoraallada', e3: 'Dooro ugu yaraan hal luqad'
    }
  },
  bo: {
    nm: 'བོད་ཡིག',
    dir: 'ltr',
    c: { t: 'ཟིན་བྲིས།', s: 'འཚོལ་བ།', e: 'ཟིན་བྲིས་མེད།', z: 'འབྲས་བུ་མ་རྙེད།', n: 'ཟིན་བྲིས་གསར་པ།', d: 'བསུབ་པ།', b: 'ཕྱིར་ལོག', p: 'འདིར་བྲིས།…', f: 'ཟིན་བྲིས' },
    r: {
      bk: 'ཕྱིར་ལོག', pv: 'སྔོན་མ།', nx: 'རྗེས་མ།', f: 'ཡིག་གཟུགས་ཆེ་ཆུང་།', th: 'ཁ་དོག', cp: 'འདྲ་བཤུས་སྤྲོད་པ།', ab: 'ངོ་སྤྲོད།', x: 'ཁ་རྒྱག', s: 'འཚོལ་བ།', m: 'གཞན།', z: 'འབྲས་བུ་མ་རྙེད།',
      k1: 'གསང་ཨང་གསར་པ།', k2: 'གསང་ཨང་ཡང་བསྐྱར་བྲིས།', fn: 'ཡིག་ཆའི་མིང་།', mk: 'འདྲ་བཤུས་བཟོ།', e1: 'ཉུང་མཐར་ཡིག་འབྲུ་ 16', e2: 'གསང་ཨང་གཉིས་མི་མཐུན།',
      h1: 'མི་གཞན་ཞིག་ལ་འདྲ་བཤུས་ཤིག་བཟོ། དེའི་གསང་ཨང་དེ་ཁྱེད་ཀྱི་གསང་ཨང་དང་མི་འདྲ། གསང་ཨང་ངོ་ཐུག་ནས་ཁ་ཐོག་ཏུ་ཤོད། འཕྲིན་ཐོག་ནམ་ཡང་མ་གཏོང་།',
      h2: 'འདྲ་བཤུས་གྲ་སྒྲིག་ཡོད། Bluetooth དང་། ཁཱཌ། ཡང་ན་སྐུད་པ་བརྒྱུད་ནས་སྤྲོད།', sd: 'གཏོང་བ།', sv: 'ཉར་བ།', ok: 'ཚར་སོང་།',
      hp: 'ཁ་ཕྱེ་བར། ཟིན་བྲིས་ཀྱི་འཚོལ་སྒམ་དུ་གསང་ཨང་བྲིས་ནས་ Enter གནོན། ཁ་རྒྱག་པར། ✕ དང་། ཕྱིར་ལོག ཡང་ན་ཉེར་སྤྱོད་གཞན་ལ་བརྗེ།',
      lg: 'སྐད་ཡིག', cl: 'འདྲ་བཤུས་ནང་གི་སྐད་ཡིག', cc: 'ཟིན་བྲིས་ཀྱི་སྐད་ཡིག', e3: 'ཉུང་མཐར་སྐད་ཡིག་གཅིག་འདེམས།'
    }
  }
};
