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
      k1: 'Clave nueva', k2: 'Repite la clave', fn: 'Nombre del archivo', mk: 'Crear copia', e1: 'Mínimo 16 caracteres', e2: 'Las claves no coinciden', ks: 'Clave sugerida', ot: 'Otra', h3: 'Una copia para cada persona. Que apunte la clave en papel, nunca en una nota: si la pierde, no se recupera.', fi: 'Se cierra con ✕, al bloquear el móvil, al cambiar de app, al agitarlo o tras 30 segundos sin tocar. La clave, en papel; nunca en una nota.', nc: 'Este archivo no se conecta a nada ni envía datos.',
      h1: 'Crea una copia para otra persona. Llevará su propia clave y será distinta de la tuya. Dile la clave en persona, nunca por mensaje.',
      h2: 'Copia lista. Pásala por Bluetooth, tarjeta o cable.', sd: 'Enviar', sv: 'Guardar', ok: 'Hecho',
      hp: 'Para abrir: escribe la clave en Buscar y pulsa Intro. Se cierra con ✕, al bloquear el móvil, al cambiar de app, al agitarlo o tras 30 segundos sin tocar.',
      lg: 'Idioma', cl: 'Idiomas de la copia', cc: 'Idioma de las notas', e3: 'Elige al menos un idioma', ca: 'Marcar todo', cn: 'Desmarcar todo'
    }
  },
  en: {
    nm: 'English',
    dir: 'ltr',
    c: { t: 'Notes', s: 'Search', e: 'No notes yet', z: 'No results', n: 'New note', d: 'Delete', b: 'Back', p: 'Write here…', f: 'notes' },
    r: {
      bk: 'Back', pv: 'Previous', nx: 'Next', f: 'Text size', th: 'Theme', cp: 'Pass on a copy', ab: 'About', x: 'Close', s: 'Search', m: 'More', z: 'No results',
      k1: 'New passphrase', k2: 'Repeat the passphrase', fn: 'File name', mk: 'Make copy', e1: 'At least 16 characters', e2: 'The passphrases do not match', ks: 'Suggested passphrase', ot: 'Another', h3: 'One copy per person. They should write the passphrase on paper, never in a note: if it is lost, it cannot be recovered.', fi: 'It closes with ✕, when you lock the phone, switch apps or shake it, or after 30 seconds without a touch. Passphrase on paper, never in a note.', nc: 'This file connects to nothing and sends no data.',
      h1: 'Make a copy for someone else. It gets its own passphrase and is different from yours. Tell them the passphrase in person, never in a message.',
      h2: 'Copy ready. Pass it on by Bluetooth, card or cable.', sd: 'Send', sv: 'Save', ok: 'Done',
      hp: 'To open: type the passphrase in Search and press Enter. It closes with ✕, when you lock the phone, switch apps or shake it, or after 30 seconds without a touch.',
      lg: 'Language', cl: 'Languages in the copy', cc: 'Language of the notes', e3: 'Choose at least one language', ca: 'Select all', cn: 'Clear all'
    }
  },
  fr: {
    nm: 'Français',
    dir: 'ltr',
    c: { t: 'Notes', s: 'Rechercher', e: 'Aucune note', z: 'Aucun résultat', n: 'Nouvelle note', d: 'Supprimer', b: 'Retour', p: 'Écrivez ici…', f: 'notes' },
    r: {
      bk: 'Retour', pv: 'Précédent', nx: 'Suivant', f: 'Taille du texte', th: 'Thème', cp: 'Donner une copie', ab: 'À propos', x: 'Fermer', s: 'Rechercher', m: 'Plus', z: 'Aucun résultat',
      k1: 'Nouvelle phrase secrète', k2: 'Répétez la phrase secrète', fn: 'Nom du fichier', mk: 'Créer la copie', e1: '16 caractères minimum', e2: 'Les deux phrases ne correspondent pas', ks: 'Phrase secrète suggérée', ot: 'Une autre', h3: 'Une copie par personne. Qu’elle note la phrase secrète sur papier, jamais dans une note : perdue, elle ne se récupère pas.', fi: 'Il se ferme avec ✕, en verrouillant le téléphone, en changeant d’appli, en le secouant ou après 30 secondes sans contact. La phrase secrète sur papier, jamais dans une note.', nc: 'Ce fichier ne se connecte à rien et n’envoie aucune donnée.',
      h1: 'Créez une copie pour quelqu’un d’autre. Elle aura sa propre phrase secrète et sera différente de la vôtre. Donnez la phrase de vive voix, jamais par message.',
      h2: 'Copie prête. Transmettez-la par Bluetooth, carte ou câble.', sd: 'Envoyer', sv: 'Enregistrer', ok: 'Terminé',
      hp: 'Pour ouvrir : tapez la phrase secrète dans Rechercher et appuyez sur Entrée. Il se ferme avec ✕, en verrouillant le téléphone, en changeant d’appli, en le secouant ou après 30 secondes sans contact.',
      lg: 'Langue', cl: 'Langues de la copie', cc: 'Langue des notes', e3: 'Choisissez au moins une langue', ca: 'Tout cocher', cn: 'Tout décocher'
    }
  },
  pt: {
    nm: 'Português',
    dir: 'ltr',
    c: { t: 'Notas', s: 'Buscar', e: 'Nenhuma nota', z: 'Nenhum resultado', n: 'Nova nota', d: 'Excluir', b: 'Voltar', p: 'Escreva aqui…', f: 'notas' },
    r: {
      bk: 'Voltar', pv: 'Anterior', nx: 'Próximo', f: 'Tamanho da letra', th: 'Tema', cp: 'Passar uma cópia', ab: 'Sobre', x: 'Fechar', s: 'Buscar', m: 'Mais', z: 'Nenhum resultado',
      k1: 'Nova senha', k2: 'Repita a senha', fn: 'Nome do arquivo', mk: 'Criar cópia', e1: 'Mínimo de 16 caracteres', e2: 'As senhas não coincidem', ks: 'Senha sugerida', ot: 'Outra', h3: 'Uma cópia para cada pessoa. Ela deve anotar a senha em papel, nunca numa nota: se a perder, não há como recuperá-la.', fi: 'Fecha com ✕, ao bloquear o celular, trocar de app, sacudi-lo ou após 30 segundos sem toque. Senha no papel, nunca numa nota.', nc: 'Este arquivo não se conecta a nada nem envia dados.',
      h1: 'Crie uma cópia para outra pessoa. Ela terá a própria senha e será diferente da sua. Diga a senha pessoalmente, nunca por mensagem.',
      h2: 'Cópia pronta. Passe por Bluetooth, cartão ou cabo.', sd: 'Enviar', sv: 'Salvar', ok: 'Concluído',
      hp: 'Para abrir: digite a senha em Buscar e toque em Enter. Fecha com ✕, ao bloquear o celular, trocar de app, sacudi-lo ou após 30 segundos sem toque.',
      lg: 'Idioma', cl: 'Idiomas da cópia', cc: 'Idioma das notas', e3: 'Escolha pelo menos um idioma', ca: 'Marcar tudo', cn: 'Desmarcar tudo'
    }
  },
  ru: {
    nm: 'Русский',
    dir: 'ltr',
    c: { t: 'Заметки', s: 'Поиск', e: 'Заметок нет', z: 'Ничего не найдено', n: 'Новая заметка', d: 'Удалить', b: 'Назад', p: 'Пишите здесь…', f: 'заметки' },
    r: {
      bk: 'Назад', pv: 'Назад', nx: 'Вперёд', f: 'Размер шрифта', th: 'Тема', cp: 'Передать копию', ab: 'О тексте', x: 'Закрыть', s: 'Поиск', m: 'Ещё', z: 'Ничего не найдено',
      k1: 'Новый пароль', k2: 'Повторите пароль', fn: 'Имя файла', mk: 'Создать копию', e1: 'Не менее 16 символов', e2: 'Пароли не совпадают', ks: 'Предлагаемый пароль', ot: 'Другой', h3: 'Каждому человеку — своя копия. Пусть запишет пароль на бумаге, а не в заметке: потерянный пароль восстановить нельзя.', fi: 'Закрывается кнопкой ✕, при блокировке телефона, смене приложения, встряхивании или через 30 секунд без касаний. Пароль — на бумаге, не в заметке.', nc: 'Этот файл ни к чему не подключается и не отправляет данные.',
      h1: 'Создайте копию для другого человека. У неё будет свой пароль, и она будет отличаться от вашей. Сообщите пароль лично, не в сообщении.',
      h2: 'Копия готова. Передайте её по Bluetooth, на карте памяти или по кабелю.', sd: 'Отправить', sv: 'Сохранить', ok: 'Готово',
      hp: 'Чтобы открыть: введите пароль в поле «Поиск» и нажмите Enter. Закрывается кнопкой ✕, при блокировке телефона, смене приложения, встряхивании или через 30 секунд без касаний.',
      lg: 'Язык', cl: 'Языки в копии', cc: 'Язык заметок', e3: 'Выберите хотя бы один язык', ca: 'Выбрать все', cn: 'Снять все'
    }
  },
  ar: {
    nm: 'العربية',
    dir: 'rtl',
    c: { t: 'ملاحظات', s: 'بحث', e: 'لا توجد ملاحظات', z: 'لا توجد نتائج', n: 'ملاحظة جديدة', d: 'حذف', b: 'رجوع', p: 'اكتب هنا…', f: 'ملاحظات' },
    r: {
      bk: 'رجوع', pv: 'السابق', nx: 'التالي', f: 'حجم الخط', th: 'المظهر', cp: 'إعطاء نسخة', ab: 'حول', x: 'إغلاق', s: 'بحث', m: 'المزيد', z: 'لا توجد نتائج',
      k1: 'كلمة سر جديدة', k2: 'أعد كتابة كلمة السر', fn: 'اسم الملف', mk: 'إنشاء النسخة', e1: '١٦ حرفًا على الأقل', e2: 'كلمتا السر غير متطابقتين', ks: 'كلمة سر مقترحة', ot: 'غيرها', h3: 'نسخة لكل شخص. ليكتب كلمة السر على ورقة، لا في ملاحظة: إن ضاعت فلا يمكن استرجاعها.', fi: 'يُغلق بـ ✕، أو بقفل الهاتف، أو بالانتقال إلى تطبيق آخر، أو بهزّه، أو بعد ٣٠ ثانية دون لمس. كلمة السر على ورقة، لا في ملاحظة.', nc: 'هذا الملف لا يتصل بأي شيء ولا يرسل أي بيانات.',
      h1: 'أنشئ نسخة لشخص آخر. ستكون لها كلمة سر خاصة بها وتختلف عن نسختك. أخبره بكلمة السر وجهًا لوجه، لا في رسالة.',
      h2: 'النسخة جاهزة. أعطها عبر البلوتوث أو بطاقة الذاكرة أو الكابل.', sd: 'إرسال', sv: 'حفظ', ok: 'تم',
      hp: 'للفتح: اكتب كلمة السر في «بحث» واضغط Enter. يُغلق بـ ✕، أو بقفل الهاتف، أو بالانتقال إلى تطبيق آخر، أو بهزّه، أو بعد ٣٠ ثانية دون لمس.',
      lg: 'اللغة', cl: 'لغات النسخة', cc: 'لغة الملاحظات', e3: 'اختر لغة واحدة على الأقل', ca: 'تحديد الكل', cn: 'إلغاء تحديد الكل'
    }
  },
  fa: {
    nm: 'فارسی',
    dir: 'rtl',
    c: { t: 'یادداشت‌ها', s: 'جستجو', e: 'یادداشتی وجود ندارد', z: 'نتیجه‌ای پیدا نشد', n: 'یادداشت جدید', d: 'حذف', b: 'بازگشت', p: 'اینجا بنویسید…', f: 'یادداشت' },
    r: {
      bk: 'بازگشت', pv: 'قبلی', nx: 'بعدی', f: 'اندازهٔ قلم', th: 'پوسته', cp: 'دادن یک نسخه', ab: 'درباره', x: 'بستن', s: 'جستجو', m: 'بیشتر', z: 'نتیجه‌ای پیدا نشد',
      k1: 'رمز جدید', k2: 'تکرار رمز', fn: 'نام فایل', mk: 'ساخت نسخه', e1: 'دست‌کم ۱۶ نویسه', e2: 'رمزها یکسان نیستند', ks: 'رمز پیشنهادی', ot: 'یکی دیگر', h3: 'برای هر نفر یک نسخه. رمز را روی کاغذ بنویسد، نه در یادداشت: اگر گم شود، قابل بازیابی نیست.', fi: 'با ✕، قفل کردن گوشی، رفتن به برنامهٔ دیگر، تکان دادن گوشی یا پس از ۳۰ ثانیه بدون لمس بسته می‌شود. رمز روی کاغذ، نه در یادداشت.', nc: 'این فایل به هیچ جا وصل نمی‌شود و هیچ داده‌ای نمی‌فرستد.',
      h1: 'برای شخص دیگری یک نسخه بسازید. آن نسخه رمز خودش را دارد و با نسخهٔ شما فرق می‌کند. رمز را حضوری بگویید، نه در پیام.',
      h2: 'نسخه آماده است. آن را با بلوتوث، کارت حافظه یا کابل بدهید.', sd: 'ارسال', sv: 'ذخیره', ok: 'انجام شد',
      hp: 'برای باز کردن: رمز را در «جستجو» بنویسید و Enter را بزنید. با ✕، قفل کردن گوشی، رفتن به برنامهٔ دیگر، تکان دادن گوشی یا پس از ۳۰ ثانیه بدون لمس بسته می‌شود.',
      lg: 'زبان', cl: 'زبان‌های نسخه', cc: 'زبان یادداشت‌ها', e3: 'دست‌کم یک زبان انتخاب کنید', ca: 'انتخاب همه', cn: 'لغو انتخاب همه'
    }
  },
  zh: {
    nm: '中文',
    dir: 'ltr',
    c: { t: '备忘录', s: '搜索', e: '没有备忘录', z: '没有结果', n: '新建', d: '删除', b: '返回', p: '在此输入…', f: '备忘录' },
    r: {
      bk: '返回', pv: '上一章', nx: '下一章', f: '字号', th: '主题', cp: '给别人一份', ab: '关于', x: '关闭', s: '搜索', m: '更多', z: '没有结果',
      k1: '新密码', k2: '再输入一次', fn: '文件名', mk: '生成副本', e1: '至少 16 个字符', e2: '两次输入不一致', ks: '建议的密码', ot: '换一个', h3: '每人一份副本。请对方把密码写在纸上，不要记在备忘录里：密码丢失后无法找回。', fi: '点 ✕、锁屏、切换应用、摇动手机或 30 秒不触碰，都会关闭。密码写在纸上，不要记在备忘录里。', nc: '此文件不连接任何地方，也不发送任何数据。',
      h1: '为别人生成一份副本。它有自己的密码，和你的这份不同。请当面告诉对方密码，不要用消息发送。',
      h2: '副本已生成。请通过蓝牙、存储卡或数据线传给对方。', sd: '发送', sv: '保存', ok: '完成',
      hp: '打开：在“搜索”框中输入密码并按回车。点 ✕、锁屏、切换应用、摇动手机或 30 秒不触碰，都会关闭。',
      lg: '语言', cl: '副本包含的语言', cc: '笔记的语言', e3: '请至少选择一种语言', ca: '全选', cn: '全不选'
    }
  },
  id: {
    nm: 'Bahasa Indonesia',
    dir: 'ltr',
    c: { t: 'Catatan', s: 'Cari', e: 'Belum ada catatan', z: 'Tidak ada hasil', n: 'Catatan baru', d: 'Hapus', b: 'Kembali', p: 'Tulis di sini…', f: 'catatan' },
    r: {
      bk: 'Kembali', pv: 'Sebelumnya', nx: 'Berikutnya', f: 'Ukuran huruf', th: 'Tema', cp: 'Berikan salinan', ab: 'Tentang', x: 'Tutup', s: 'Cari', m: 'Lainnya', z: 'Tidak ada hasil',
      k1: 'Kata sandi baru', k2: 'Ulangi kata sandi', fn: 'Nama berkas', mk: 'Buat salinan', e1: 'Minimal 16 karakter', e2: 'Kata sandi tidak sama', ks: 'Kata sandi usulan', ot: 'Yang lain', h3: 'Satu salinan untuk setiap orang. Mintalah ia menulis kata sandi di kertas, jangan di catatan: jika hilang, tidak bisa dipulihkan.', fi: 'Tertutup dengan ✕, saat ponsel dikunci, pindah aplikasi, ponsel diguncang, atau setelah 30 detik tanpa disentuh. Kata sandi di kertas, jangan di catatan.', nc: 'Berkas ini tidak terhubung ke mana pun dan tidak mengirim data apa pun.',
      h1: 'Buat salinan untuk orang lain. Salinan itu punya kata sandi sendiri dan berbeda dari milik Anda. Sampaikan kata sandinya secara langsung, jangan lewat pesan.',
      h2: 'Salinan siap. Berikan lewat Bluetooth, kartu memori, atau kabel.', sd: 'Kirim', sv: 'Simpan', ok: 'Selesai',
      hp: 'Untuk membuka: ketik kata sandi di Cari lalu tekan Enter. Tertutup dengan ✕, saat ponsel dikunci, pindah aplikasi, ponsel diguncang, atau setelah 30 detik tanpa disentuh.',
      lg: 'Bahasa', cl: 'Bahasa dalam salinan', cc: 'Bahasa catatan', e3: 'Pilih setidaknya satu bahasa', ca: 'Pilih semua', cn: 'Batalkan semua'
    }
  },
  vi: {
    nm: 'Tiếng Việt',
    dir: 'ltr',
    c: { t: 'Ghi chú', s: 'Tìm kiếm', e: 'Chưa có ghi chú', z: 'Không có kết quả', n: 'Ghi chú mới', d: 'Xóa', b: 'Quay lại', p: 'Viết tại đây…', f: 'ghi chú' },
    r: {
      bk: 'Quay lại', pv: 'Trước', nx: 'Tiếp', f: 'Cỡ chữ', th: 'Giao diện', cp: 'Trao một bản sao', ab: 'Giới thiệu', x: 'Đóng', s: 'Tìm kiếm', m: 'Khác', z: 'Không có kết quả',
      k1: 'Mật khẩu mới', k2: 'Nhập lại mật khẩu', fn: 'Tên tệp', mk: 'Tạo bản sao', e1: 'Ít nhất 16 ký tự', e2: 'Hai mật khẩu không khớp', ks: 'Mật khẩu gợi ý', ot: 'Mật khẩu khác', h3: 'Mỗi người một bản sao. Hãy để họ ghi mật khẩu ra giấy, đừng ghi vào ghi chú: mất là không lấy lại được.', fi: 'Đóng bằng ✕, khi khóa điện thoại, chuyển ứng dụng, lắc máy hoặc sau 30 giây không chạm. Mật khẩu ghi trên giấy, đừng ghi vào ghi chú.', nc: 'Tệp này không kết nối với bất cứ đâu và không gửi dữ liệu nào.',
      h1: 'Tạo một bản sao cho người khác. Bản sao đó có mật khẩu riêng và khác với bản của bạn. Hãy nói mật khẩu trực tiếp, đừng gửi qua tin nhắn.',
      h2: 'Bản sao đã sẵn sàng. Hãy chuyển qua Bluetooth, thẻ nhớ hoặc cáp.', sd: 'Gửi', sv: 'Lưu', ok: 'Xong',
      hp: 'Để mở: nhập mật khẩu vào ô Tìm kiếm rồi nhấn Enter. Đóng bằng ✕, khi khóa điện thoại, chuyển ứng dụng, lắc máy hoặc sau 30 giây không chạm.',
      lg: 'Ngôn ngữ', cl: 'Ngôn ngữ trong bản sao', cc: 'Ngôn ngữ của ghi chú', e3: 'Hãy chọn ít nhất một ngôn ngữ', ca: 'Chọn tất cả', cn: 'Bỏ chọn tất cả'
    }
  },
  my: {
    nm: 'မြန်မာ',
    dir: 'ltr',
    c: { t: 'မှတ်စုများ', s: 'ရှာဖွေရန်', e: 'မှတ်စု မရှိပါ', z: 'ရလဒ် မတွေ့ပါ', n: 'မှတ်စုအသစ်', d: 'ဖျက်ရန်', b: 'နောက်သို့', p: 'ဤနေရာတွင် ရေးပါ…', f: 'မှတ်စု' },
    r: {
      bk: 'နောက်သို့', pv: 'ယခင်အခန်း', nx: 'နောက်အခန်း', f: 'စာလုံးအရွယ်အစား', th: 'အပြင်အဆင်', cp: 'မိတ္တူတစ်ခု ပေးရန်', ab: 'အကြောင်း', x: 'ပိတ်ရန်', s: 'ရှာဖွေရန်', m: 'နောက်ထပ်', z: 'ရလဒ် မတွေ့ပါ',
      k1: 'စကားဝှက်အသစ်', k2: 'စကားဝှက်ကို ထပ်ရိုက်ပါ', fn: 'ဖိုင်အမည်', mk: 'မိတ္တူ ပြုလုပ်ရန်', e1: 'အနည်းဆုံး စာလုံး ၁၆ လုံး', e2: 'စကားဝှက်နှစ်ခု မတူညီပါ', ks: 'အကြံပြုထားသော စကားဝှက်', ot: 'နောက်တစ်ခု', h3: 'လူတစ်ဦးချင်းစီအတွက် မိတ္တူတစ်ခုစီ။ စကားဝှက်ကို မှတ်စုထဲတွင် မရေးဘဲ စာရွက်ပေါ်တွင် ရေးထားပါစေ။ ပျောက်သွားလျှင် ပြန်ရ၍ မရပါ။', fi: '✕ နှိပ်ခြင်း၊ ဖုန်းကို လော့ခ်ချခြင်း၊ အက်ပ်ပြောင်းခြင်း၊ ဖုန်းကို လှုပ်ခြင်း သို့မဟုတ် စက္ကန့် ၃၀ မထိခြင်းဖြင့် ပိတ်သွားပါမည်။ စကားဝှက်ကို မှတ်စုထဲတွင် မရေးဘဲ စာရွက်ပေါ်တွင် သိမ်းထားပါ။', nc: 'ဤဖိုင်သည် မည်သည့်နေရာနှင့်မျှ မချိတ်ဆက်ဘဲ မည်သည့်ဒေတာကိုမျှ မပို့ပါ။',
      h1: 'အခြားသူတစ်ဦးအတွက် မိတ္တူတစ်ခု ပြုလုပ်ပါ။ ထိုမိတ္တူတွင် ကိုယ်ပိုင်စကားဝှက် ပါရှိပြီး သင့်မိတ္တူနှင့် မတူပါ။ စကားဝှက်ကို မျက်နှာချင်းဆိုင် ပြောပြပါ၊ မက်ဆေ့ချ်ဖြင့် မပို့ပါနှင့်။',
      h2: 'မိတ္တူ အသင့်ဖြစ်ပါပြီ။ Bluetooth၊ မန်မိုရီကတ် သို့မဟုတ် ကြိုးဖြင့် ပေးပါ။', sd: 'ပို့ရန်', sv: 'သိမ်းရန်', ok: 'ပြီးပါပြီ',
      hp: 'ဖွင့်ရန် - မှတ်စုများ၏ ရှာဖွေရေးအကွက်တွင် စကားဝှက်ကို ရိုက်ထည့်ပြီး Enter နှိပ်ပါ။ ✕ နှိပ်ခြင်း၊ ဖုန်းကို လော့ခ်ချခြင်း၊ အက်ပ်ပြောင်းခြင်း၊ ဖုန်းကို လှုပ်ခြင်း သို့မဟုတ် စက္ကန့် ၃၀ မထိခြင်းဖြင့် ပိတ်သွားပါမည်။',
      lg: 'ဘာသာစကား', cl: 'မိတ္တူတွင် ပါမည့် ဘာသာစကားများ', cc: 'မှတ်စုများ၏ ဘာသာစကား', e3: 'ဘာသာစကား အနည်းဆုံး တစ်ခု ရွေးပါ', ca: 'အားလုံး ရွေးမည်', cn: 'အားလုံး ပယ်ဖျက်မည်'
    }
  },
  tr: {
    nm: 'Türkçe',
    dir: 'ltr',
    c: { t: 'Notlar', s: 'Ara', e: 'Not yok', z: 'Sonuç yok', n: 'Yeni not', d: 'Sil', b: 'Geri', p: 'Buraya yazın…', f: 'notlar' },
    r: {
      bk: 'Geri', pv: 'Önceki', nx: 'Sonraki', f: 'Yazı boyutu', th: 'Tema', cp: 'Kopya ver', ab: 'Hakkında', x: 'Kapat', s: 'Ara', m: 'Diğer', z: 'Sonuç yok',
      k1: 'Yeni parola', k2: 'Parolayı tekrarlayın', fn: 'Dosya adı', mk: 'Kopya oluştur', e1: 'En az 16 karakter', e2: 'Parolalar eşleşmiyor', ks: 'Önerilen parola', ot: 'Başka', h3: 'Her kişiye ayrı bir kopya. Parolayı kâğıda yazsın, asla bir nota değil: kaybolursa geri alınamaz.', fi: '✕ ile, telefonu kilitleyince, uygulama değiştirince, sallayınca ya da 30 saniye dokunulmayınca kapanır. Parola kâğıtta, asla notta değil.', nc: 'Bu dosya hiçbir yere bağlanmaz ve hiçbir veri göndermez.',
      h1: 'Başka biri için bir kopya oluşturun. Kopyanın kendi parolası olur ve sizinkinden farklıdır. Parolayı yüz yüze söyleyin, mesajla göndermeyin.',
      h2: 'Kopya hazır. Bluetooth, hafıza kartı veya kabloyla verin.', sd: 'Gönder', sv: 'Kaydet', ok: 'Tamam',
      hp: 'Açmak için: parolayı Ara kutusuna yazıp Enter’a basın. ✕ ile, telefonu kilitleyince, uygulama değiştirince, sallayınca ya da 30 saniye dokunulmayınca kapanır.',
      lg: 'Dil', cl: 'Kopyadaki diller', cc: 'Notların dili', e3: 'En az bir dil seçin', ca: 'Tümünü seç', cn: 'Seçimi kaldır'
    }
  },
  hi: {
    nm: 'हिन्दी',
    dir: 'ltr',
    c: { t: 'नोट्स', s: 'खोजें', e: 'कोई नोट नहीं है', z: 'कोई परिणाम नहीं मिला', n: 'नया नोट', d: 'हटाएँ', b: 'वापस', p: 'यहाँ लिखें…', f: 'नोट्स' },
    r: {
      bk: 'वापस', pv: 'पिछला', nx: 'अगला', f: 'अक्षरों का आकार', th: 'थीम', cp: 'एक प्रति दें', ab: 'जानकारी', x: 'बंद करें', s: 'खोजें', m: 'और', z: 'कोई परिणाम नहीं मिला',
      k1: 'नया पासवर्ड', k2: 'पासवर्ड दोबारा लिखें', fn: 'फ़ाइल का नाम', mk: 'प्रति बनाएँ', e1: 'कम से कम 16 अक्षर', e2: 'दोनों पासवर्ड एक जैसे नहीं हैं', ks: 'सुझाया गया पासवर्ड', ot: 'दूसरा', h3: 'हर व्यक्ति के लिए अलग प्रति। वह पासवर्ड काग़ज़ पर लिखे, किसी नोट में नहीं: खो जाने पर वापस नहीं मिल सकता।', fi: '✕ दबाने, फ़ोन लॉक करने, ऐप बदलने, फ़ोन हिलाने या 30 सेकंड तक न छूने पर यह बंद हो जाता है। पासवर्ड काग़ज़ पर रखें, नोट में नहीं।', nc: 'यह फ़ाइल कहीं नहीं जुड़ती और कोई डेटा नहीं भेजती।',
      h1: 'किसी और के लिए एक प्रति बनाएँ। उसका अपना पासवर्ड होगा और वह आपकी प्रति से अलग होगी। पासवर्ड आमने-सामने बताएँ, संदेश में न भेजें।',
      h2: 'प्रति तैयार है। इसे ब्लूटूथ, मेमोरी कार्ड या केबल से दें।', sd: 'भेजें', sv: 'सहेजें', ok: 'हो गया',
      hp: 'खोलने के लिए: पासवर्ड खोज बॉक्स में लिखें और Enter दबाएँ। ✕ दबाने, फ़ोन लॉक करने, ऐप बदलने, फ़ोन हिलाने या 30 सेकंड तक न छूने पर यह बंद हो जाता है।',
      lg: 'भाषा', cl: 'प्रति में भाषाएँ', cc: 'नोट्स की भाषा', e3: 'कम से कम एक भाषा चुनें', ca: 'सभी चुनें', cn: 'सभी हटाएँ'
    }
  },
  ko: {
    nm: '한국어',
    dir: 'ltr',
    c: { t: '메모', s: '검색', e: '메모가 없습니다', z: '결과 없음', n: '새 메모', d: '삭제', b: '뒤로', p: '여기에 입력…', f: '메모' },
    r: {
      bk: '뒤로', pv: '이전', nx: '다음', f: '글자 크기', th: '테마', cp: '사본 전달', ab: '정보', x: '닫기', s: '검색', m: '더보기', z: '결과 없음',
      k1: '새 암호', k2: '암호 다시 입력', fn: '파일 이름', mk: '사본 만들기', e1: '16자 이상 입력하세요', e2: '암호가 일치하지 않습니다', ks: '추천 암호', ot: '다른 암호', h3: '한 사람에게 한 부씩. 암호는 메모가 아니라 종이에 적게 하세요. 잃어버리면 되찾을 수 없습니다.', fi: '✕, 휴대폰 잠금, 앱 전환, 흔들기, 또는 30초 동안 만지지 않으면 닫힙니다. 암호는 메모가 아니라 종이에.', nc: '이 파일은 어디에도 연결하지 않으며 어떤 데이터도 보내지 않습니다.',
      h1: '다른 사람에게 줄 사본을 만듭니다. 사본은 자체 암호를 가지며 내 파일과 다릅니다. 암호는 메시지로 보내지 말고 직접 만나서 알려 주세요.',
      h2: '사본이 준비되었습니다. 블루투스, 메모리 카드 또는 케이블로 전달하세요.', sd: '보내기', sv: '저장', ok: '완료',
      hp: '열기: 검색에 암호를 입력하고 Enter. ✕, 휴대폰 잠금, 앱 전환, 흔들기, 또는 30초 동안 만지지 않으면 닫힙니다.',
      lg: '언어', cl: '사본에 넣을 언어', cc: '메모 언어', e3: '언어를 하나 이상 선택하세요', ca: '모두 선택', cn: '모두 해제'
    }
  },
  bn: {
    nm: 'বাংলা',
    dir: 'ltr',
    c: { t: 'নোট', s: 'খুঁজুন', e: 'কোনো নোট নেই', z: 'কোনো ফলাফল নেই', n: 'নতুন নোট', d: 'মুছুন', b: 'পিছনে', p: 'এখানে লিখুন…', f: 'নোট' },
    r: {
      bk: 'পিছনে', pv: 'আগের', nx: 'পরের', f: 'লেখার আকার', th: 'থিম', cp: 'একটি কপি দিন', ab: 'অ্যাপ সম্পর্কে', x: 'বন্ধ করুন', s: 'খুঁজুন', m: 'আরও', z: 'কোনো ফলাফল নেই',
      k1: 'নতুন পাসওয়ার্ড', k2: 'পাসওয়ার্ড আবার লিখুন', fn: 'ফাইলের নাম', mk: 'কপি তৈরি করুন', e1: 'কমপক্ষে 16টি অক্ষর', e2: 'পাসওয়ার্ড দুটি মিলছে না', ks: 'প্রস্তাবিত পাসওয়ার্ড', ot: 'অন্যটি', h3: 'প্রত্যেকের জন্য আলাদা কপি। পাসওয়ার্ড কাগজে লিখে রাখতে বলুন, কোনো নোটে নয়: হারালে আর ফেরত পাওয়া যায় না।', fi: '✕ চাপলে, ফোন লক করলে, অ্যাপ বদলালে, ফোন ঝাঁকালে বা 30 সেকেন্ড না ছুঁলে বন্ধ হয়ে যায়। পাসওয়ার্ড কাগজে রাখুন, কোনো নোটে নয়।', nc: 'এই ফাইল কোথাও সংযোগ করে না এবং কোনো তথ্য পাঠায় না।',
      h1: 'অন্য কারও জন্য একটি কপি তৈরি করুন। কপিটির পাসওয়ার্ড আপনার পাসওয়ার্ড থেকে আলাদা হবে। পাসওয়ার্ডটি সেই ব্যক্তিকে সামনাসামনি বলুন, কখনো মেসেজে পাঠাবেন না।',
      h2: 'কপিটি প্রস্তুত। ব্লুটুথ, মেমোরি কার্ড বা কেবলের মাধ্যমে দিন।', sd: 'পাঠান', sv: 'সংরক্ষণ করুন', ok: 'হয়ে গেছে',
      hp: 'খুলতে: নোটের সার্চ বক্সে পাসওয়ার্ড লিখে Enter চাপুন। ✕ চাপলে, ফোন লক করলে, অ্যাপ বদলালে, ফোন ঝাঁকালে বা 30 সেকেন্ড না ছুঁলে বন্ধ হয়ে যায়।',
      lg: 'ভাষা', cl: 'কপিতে যে ভাষাগুলো থাকবে', cc: 'নোটের ভাষা', e3: 'অন্তত একটি ভাষা বেছে নিন', ca: 'সব নির্বাচন করুন', cn: 'সব বাদ দিন'
    }
  },
  ha: {
    nm: 'Hausa',
    dir: 'ltr',
    c: { t: 'Rubuce-rubuce', s: 'Nema', e: 'Babu rubutu tukuna', z: 'Ba a sami komai ba', n: 'Sabon rubutu', d: 'Goge', b: 'Koma baya', p: 'Rubuta a nan…', f: 'rubuce-rubuce' },
    r: {
      bk: 'Koma baya', pv: 'Na baya', nx: 'Na gaba', f: 'Girman rubutu', th: 'Yanayin nuni', cp: 'Ba da kwafi', ab: 'Game da manhajar', x: 'Rufe', s: 'Nema', m: 'Ƙari', z: 'Ba a sami komai ba',
      k1: 'Sabuwar kalmar sirri', k2: 'Maimaita kalmar sirri', fn: 'Sunan fayil', mk: 'Yi kwafi', e1: 'Aƙalla haruffa 16', e2: 'Kalmomin sirrin ba su yi daidai ba', ks: 'Kalmar sirri da aka ba da shawara', ot: 'Wata', h3: 'Kwafi ɗaya ga kowane mutum. Ya rubuta kalmar sirri a takarda, ba a cikin rubutu ba: idan ta ɓace, ba za a iya dawo da ita ba.', fi: 'Yana rufewa da ✕, idan ka kulle waya, ka koma wata manhaja, ka girgiza waya, ko bayan daƙiƙa 30 ba tare da taɓawa ba. Ajiye kalmar sirri a takarda, ba a cikin rubutu ba.', nc: 'Wannan fayil ba ya haɗuwa da komai kuma ba ya aika wani bayani.',
      h1: 'Yi kwafi don wani mutum. Kwafin zai sami kalmar sirri ta kansa, wadda ta bambanta da kalmar sirrinka. Ka faɗa wa mutumin kalmar sirrin ido da ido; kada ka taɓa aika ta a saƙo.',
      h2: 'Kwafin ya shirya. Ba da shi ta Bluetooth, katin ma’ajiya ko kebul.', sd: 'Aika', sv: 'Ajiye', ok: 'An gama',
      hp: 'Don buɗewa: rubuta kalmar sirri a akwatin nema na rubuce-rubuce, sannan ka danna Enter. Yana rufewa da ✕, idan ka kulle waya, ka koma wata manhaja, ka girgiza waya, ko bayan daƙiƙa 30 ba tare da taɓawa ba.',
      lg: 'Harshe', cl: 'Harsunan da ke cikin kwafin', cc: 'Harshen rubuce-rubuce', e3: 'Zaɓi aƙalla harshe ɗaya', ca: 'Zaɓi duka', cn: 'Cire duka'
    }
  },
  ckb: {
    nm: 'کوردی',
    dir: 'rtl',
    c: { t: 'تێبینییەکان', s: 'گەڕان', e: 'هیچ تێبینییەک نییە', z: 'هیچ ئەنجامێک نییە', n: 'تێبینیی نوێ', d: 'سڕینەوە', b: 'گەڕانەوە', p: 'لێرە بنووسە…', f: 'تێبینییەکان' },
    r: {
      bk: 'گەڕانەوە', pv: 'پێشوو', nx: 'دواتر', f: 'قەبارەی نووسین', th: 'ڕووکار', cp: 'دانی کۆپییەک', ab: 'دەربارە', x: 'داخستن', s: 'گەڕان', m: 'زیاتر', z: 'هیچ ئەنجامێک نییە',
      k1: 'وشەی نهێنیی نوێ', k2: 'دووبارە وشەی نهێنی بنووسەوە', fn: 'ناوی فایل', mk: 'دروستکردنی کۆپی', e1: 'لانیکەم 16 کارەکتەر', e2: 'وشە نهێنییەکان وەک یەک نین', ks: 'وشەی نهێنیی پێشنیارکراو', ot: 'یەکێکی تر', h3: 'بۆ هەر کەسێک کۆپییەک. با وشەی نهێنی لەسەر کاغەز بنووسێت، نەک لە تێبینییەکدا: ئەگەر ون بێت، ناگەڕێتەوە.', fi: 'بە ✕، داخستنی مۆبایل، گۆڕینی ئەپ، ڕاوەشاندنی مۆبایل یان دوای 30 چرکە بێ دەستلێدان دادەخرێت. وشەی نهێنی لەسەر کاغەز هەڵبگرە، نەک لە تێبینییەکدا.', nc: 'ئەم فایلە بە هیچ شوێنێکەوە پەیوەست نابێت و هیچ زانیارییەک نانێرێت.',
      h1: 'کۆپییەک بۆ کەسێکی تر دروست بکە. وشەی نهێنیی کۆپییەکە جیاواز دەبێت لە وشەی نهێنیی تۆ. وشەی نهێنییەکە ڕووبەڕوو پێی بڵێ، هەرگیز بە پەیام مەینێرە.',
      h2: 'کۆپییەکە ئامادەیە. بە بلووتووس، کارتی بیرگە یان کێبڵ بیدە.', sd: 'ناردن', sv: 'پاشەکەوتکردن', ok: 'تەواو',
      hp: 'بۆ کردنەوە: وشەی نهێنی لە سندووقی گەڕانی تێبینییەکان بنووسە و Enter دابگرە. بە ✕، داخستنی مۆبایل، گۆڕینی ئەپ، ڕاوەشاندنی مۆبایل یان دوای 30 چرکە بێ دەستلێدان دادەخرێت.',
      lg: 'زمان', cl: 'زمانەکانی ناو کۆپییەکە', cc: 'زمانی تێبینییەکان', e3: 'لانیکەم یەک زمان هەڵبژێرە', ca: 'هەموو هەڵبژێرە', cn: 'هەموو لابە'
    }
  },
  ug: {
    nm: 'ئۇيغۇرچە',
    dir: 'rtl',
    c: { t: 'خاتىرە', s: 'ئىزدەش', e: 'خاتىرە يوق', z: 'نەتىجە يوق', n: 'يېڭى خاتىرە', d: 'ئۆچۈرۈش', b: 'قايتىش', p: 'بۇ يەرگە يېزىڭ…', f: 'خاتىرە' },
    r: {
      bk: 'قايتىش', pv: 'ئالدىنقى', nx: 'كېيىنكى', f: 'خەت چوڭلۇقى', th: 'كۆرۈنۈش', cp: 'كۆچۈرمە بېرىش', ab: 'ھەققىدە', x: 'تاقاش', s: 'ئىزدەش', m: 'تېخىمۇ كۆپ', z: 'نەتىجە يوق',
      k1: 'يېڭى پارول', k2: 'پارولنى قايتا كىرگۈزۈڭ', fn: 'ھۆججەت نامى', mk: 'كۆچۈرمە ياساش', e1: 'كەم دېگەندە 16 ھەرپ-بەلگە', e2: 'پاروللار ماس كەلمىدى', ks: 'تەۋسىيە قىلىنغان پارول', ot: 'باشقىسى', h3: 'ھەر بىر ئادەمگە ئايرىم بىر نۇسخا. پارولنى خاتىرىگە ئەمەس، قەغەزگە يازسۇن: يوقالسا قايتۇرۇۋالغىلى بولمايدۇ.', fi: '✕ بىلەن، تېلېفوننى قۇلۇپلىغاندا، ئەپ ئالماشتۇرغاندا، تېلېفوننى سىلكىگەندە ياكى 30 سېكۇنت تەگمىگەندە تاقىلىدۇ. پارولنى خاتىرىدە ئەمەس، قەغەزدە ساقلاڭ.', nc: 'بۇ ھۆججەت ھېچ يەرگە ئۇلانمايدۇ ۋە ھېچقانداق ئۇچۇر ئەۋەتمەيدۇ.',
      h1: 'باشقا بىرسى ئۈچۈن كۆچۈرمە ياساڭ. ئۇ كۆچۈرمىنىڭ ئۆزىگە خاس پارولى بولىدۇ، بۇ پارول سىزنىڭ پارولىڭىزدىن پەرقلىق بولىدۇ. پارولنى يۈزمۇيۈز ئېيتىڭ، ھەرگىز ئۇچۇر ئارقىلىق ئەۋەتمەڭ.',
      h2: 'كۆچۈرمە تەييار. ئۇنى Bluetooth، ئەستە ساقلاش كارتىسى ياكى سىم ئارقىلىق بېرىڭ.', sd: 'ئەۋەتىش', sv: 'ساقلاش', ok: 'تامام',
      hp: 'ئېچىش ئۈچۈن: پارولنى خاتىرىلەرنىڭ ئىزدەش رامكىسىغا يېزىپ Enter نى بېسىڭ. ✕ بىلەن، تېلېفوننى قۇلۇپلىغاندا، ئەپ ئالماشتۇرغاندا، تېلېفوننى سىلكىگەندە ياكى 30 سېكۇنت تەگمىگەندە تاقىلىدۇ.',
      lg: 'تىل', cl: 'كۆچۈرمىدىكى تىللار', cc: 'خاتىرىلەرنىڭ تىلى', e3: 'كەم دېگەندە بىر تىل تاللاڭ', ca: 'ھەممىنى تاللا', cn: 'ھەممىنى بىكار قىل'
    }
  },
  ur: {
    nm: 'اردو',
    dir: 'rtl',
    c: { t: 'نوٹس', s: 'تلاش', e: 'کوئی نوٹ نہیں', z: 'کوئی نتیجہ نہیں ملا', n: 'نیا نوٹ', d: 'حذف کریں', b: 'واپس', p: 'یہاں لکھیں…', f: 'نوٹس' },
    r: {
      bk: 'واپس', pv: 'پچھلا', nx: 'اگلا', f: 'حروف کا سائز', th: 'تھیم', cp: 'ایک کاپی دیں', ab: 'ایپ کے بارے میں', x: 'بند کریں', s: 'تلاش', m: 'مزید', z: 'کوئی نتیجہ نہیں ملا',
      k1: 'نیا پاس ورڈ', k2: 'پاس ورڈ دوبارہ لکھیں', fn: 'فائل کا نام', mk: 'کاپی بنائیں', e1: 'کم از کم 16 حروف', e2: 'دونوں پاس ورڈ ایک جیسے نہیں ہیں', ks: 'تجویز کردہ پاس ورڈ', ot: 'کوئی اور', h3: 'ہر شخص کے لیے الگ کاپی۔ وہ پاس ورڈ کاغذ پر لکھے، کسی نوٹ میں نہیں: کھو جائے تو واپس نہیں مل سکتا۔', fi: '✕، فون لاک کرنے، ایپ بدلنے، فون ہلانے یا 30 سیکنڈ تک نہ چھونے پر یہ بند ہو جاتی ہے۔ پاس ورڈ کاغذ پر رکھیں، کسی نوٹ میں نہیں۔', nc: 'یہ فائل کہیں نہیں جڑتی اور کوئی ڈیٹا نہیں بھیجتی۔',
      h1: 'کسی اور کے لیے ایک کاپی بنائیں۔ اس کا پاس ورڈ آپ کے پاس ورڈ سے مختلف ہوگا۔ یہ پاس ورڈ اس شخص کو آمنے سامنے بتائیں، کبھی پیغام میں نہ بھیجیں۔',
      h2: 'کاپی تیار ہے۔ اسے بلوٹوتھ، میموری کارڈ یا کیبل سے دیں۔', sd: 'بھیجیں', sv: 'محفوظ کریں', ok: 'ہو گیا',
      hp: 'کھولنے کے لیے: نوٹس کے تلاش کے خانے میں پاس ورڈ لکھیں اور Enter دبائیں۔ ✕، فون لاک کرنے، ایپ بدلنے، فون ہلانے یا 30 سیکنڈ تک نہ چھونے پر یہ بند ہو جاتی ہے۔',
      lg: 'زبان', cl: 'کاپی میں شامل زبانیں', cc: 'نوٹس کی زبان', e3: 'کم از کم ایک زبان منتخب کریں', ca: 'سب منتخب کریں', cn: 'سب ہٹائیں'
    }
  },
  so: {
    nm: 'Soomaali',
    dir: 'ltr',
    c: { t: 'Qoraallo', s: 'Raadi', e: 'Wax qoraal ah ma jiraan', z: 'Natiijo lama helin', n: 'Qoraal cusub', d: 'Tirtir', b: 'Dib u noqo', p: 'Halkan ku qor…', f: 'qoraallo' },
    r: {
      bk: 'Dib u noqo', pv: 'Hore', nx: 'Xiga', f: 'Cabbirka qoraalka', th: 'Muuqaal', cp: 'Bixi nuqul', ab: 'Ku saabsan app-ka', x: 'Xir', s: 'Raadi', m: 'Ikhtiyaarro dheeraad ah', z: 'Natiijo lama helin',
      k1: 'Eray sir ah oo cusub', k2: 'Ku celi erayga sirta ah', fn: 'Magaca faylka', mk: 'Samee nuqul', e1: 'Ugu yaraan 16 xaraf', e2: 'Erayada sirta ahi isku mid ma aha', ks: 'Eray sir ah oo la soo jeediyay', ot: 'Mid kale', h3: 'Qof kasta nuqul gaar ah. Erayga sirta ah ha ku qoro warqad, ha ku qorin qoraal: haddii uu lumo, dib looma heli karo.', fi: 'Waxaa lagu xiraa ✕, quful taleefanka, beddelka app-ka, ruxidda taleefanka ama 30 ilbiriqsi oo aan la taaban. Erayga sirta ah ku hay warqad, ha ku qorin qoraal.', nc: 'Faylkan meelna kuma xirmo, xogna ma diro.',
      h1: 'Nuqul u samee qof kale. Nuqulku wuxuu yeelan doonaa eray sir ah oo u gaar ah, kaas oo ka duwanaan doona eraygaaga sirta ah. Erayga sirta ah qofka fool ka fool ugu sheeg; weligaa farriin ha ugu dirin.',
      h2: 'Nuqulku waa diyaar. Ku sii Bluetooth, kaarka xusuusta ama fiilo.', sd: 'Dir', sv: 'Kaydi', ok: 'Waa dhammaatay',
      hp: 'Si aad u furto: erayga sirta ah ku qor sanduuqa raadinta qoraallada oo riix Enter. Waxaa lagu xiraa ✕, quful taleefanka, beddelka app-ka, ruxidda taleefanka ama 30 ilbiriqsi oo aan la taaban.',
      lg: 'Luqad', cl: 'Luqadaha ku jira nuqulka', cc: 'Luqadda qoraallada', e3: 'Dooro ugu yaraan hal luqad', ca: 'Dooro dhammaan', cn: 'Ka saar dhammaan'
    }
  },
  bo: {
    nm: 'བོད་ཡིག',
    dir: 'ltr',
    c: { t: 'ཟིན་བྲིས།', s: 'འཚོལ་བ།', e: 'ཟིན་བྲིས་མེད།', z: 'འབྲས་བུ་མ་རྙེད།', n: 'ཟིན་བྲིས་གསར་པ།', d: 'བསུབ་པ།', b: 'ཕྱིར་ལོག', p: 'འདིར་བྲིས།…', f: 'ཟིན་བྲིས' },
    r: {
      bk: 'ཕྱིར་ལོག', pv: 'སྔོན་མ།', nx: 'རྗེས་མ།', f: 'ཡིག་གཟུགས་ཆེ་ཆུང་།', th: 'ཁ་དོག', cp: 'འདྲ་བཤུས་སྤྲོད་པ།', ab: 'ངོ་སྤྲོད།', x: 'ཁ་རྒྱག', s: 'འཚོལ་བ།', m: 'གཞན།', z: 'འབྲས་བུ་མ་རྙེད།',
      k1: 'གསང་ཨང་གསར་པ།', k2: 'གསང་ཨང་ཡང་བསྐྱར་བྲིས།', fn: 'ཡིག་ཆའི་མིང་།', mk: 'འདྲ་བཤུས་བཟོ།', e1: 'ཉུང་མཐར་ཡིག་འབྲུ་ 16', e2: 'གསང་ཨང་གཉིས་མི་མཐུན།', ks: 'གྲོས་འགོ་བཏང་བའི་གསང་ཨང་།', ot: 'གཞན་ཞིག', h3: 'མི་རེ་རེར་འདྲ་བཤུས་རེ། གསང་ཨང་ཟིན་བྲིས་ནང་མ་ཡིན་པར་ཤོག་བུའི་སྟེང་དུ་འབྲི་དགོས། བོར་ན་ཕྱིར་རྙེད་ཐབས་མེད།', fi: '✕ མནན་པ་དང་། ཁ་པར་ལྡེ་མིག་རྒྱག་པ། ཉེར་སྤྱོད་བརྗེ་བ། ཁ་པར་སྒུལ་བ། ཡང་ན་སྐར་ཆ་ 30 རིང་མ་རེག་ན་ཁ་རྒྱག་གི་རེད། གསང་ཨང་ཟིན་བྲིས་ནང་མ་ཡིན་པར་ཤོག་བུའི་སྟེང་དུ་ཉར།', nc: 'ཡིག་ཆ་འདི་གང་དང་ཡང་འབྲེལ་མཐུད་མི་བྱེད། གཞི་གྲངས་གང་ཡང་མི་གཏོང་།',
      h1: 'མི་གཞན་ཞིག་ལ་འདྲ་བཤུས་ཤིག་བཟོ། དེའི་གསང་ཨང་དེ་ཁྱེད་ཀྱི་གསང་ཨང་དང་མི་འདྲ། གསང་ཨང་ངོ་ཐུག་ནས་ཁ་ཐོག་ཏུ་ཤོད། འཕྲིན་ཐོག་ནམ་ཡང་མ་གཏོང་།',
      h2: 'འདྲ་བཤུས་གྲ་སྒྲིག་ཡོད། Bluetooth དང་། ཁཱཌ། ཡང་ན་སྐུད་པ་བརྒྱུད་ནས་སྤྲོད།', sd: 'གཏོང་བ།', sv: 'ཉར་བ།', ok: 'ཚར་སོང་།',
      hp: 'ཁ་ཕྱེ་བར། ཟིན་བྲིས་ཀྱི་འཚོལ་སྒམ་དུ་གསང་ཨང་བྲིས་ནས་ Enter གནོན། ✕ མནན་པ་དང་། ཁ་པར་ལྡེ་མིག་རྒྱག་པ། ཉེར་སྤྱོད་བརྗེ་བ། ཁ་པར་སྒུལ་བ། ཡང་ན་སྐར་ཆ་ 30 རིང་མ་རེག་ན་ཁ་རྒྱག་གི་རེད།',
      lg: 'སྐད་ཡིག', cl: 'འདྲ་བཤུས་ནང་གི་སྐད་ཡིག', cc: 'ཟིན་བྲིས་ཀྱི་སྐད་ཡིག', e3: 'ཉུང་མཐར་སྐད་ཡིག་གཅིག་འདེམས།', ca: 'ཀུན་འདེམས།', cn: 'ཀུན་འདོར།'
    }
  },
  sw: {
    nm: 'Kiswahili',
    dir: 'ltr',
    c: { t: 'Madokezo', s: 'Tafuta', e: 'Hakuna madokezo', z: 'Hakuna matokeo', n: 'Dokezo jipya', d: 'Futa', b: 'Rudi', p: 'Andika hapa…', f: 'madokezo' },
    r: {
      bk: 'Rudi', pv: 'Iliyotangulia', nx: 'Inayofuata', f: 'Ukubwa wa herufi', th: 'Mandhari', cp: 'Toa nakala', ab: 'Kuhusu', x: 'Funga', s: 'Tafuta', m: 'Zaidi', z: 'Hakuna matokeo',
      k1: 'Nenosiri jipya', k2: 'Rudia nenosiri', fn: 'Jina la faili', mk: 'Tengeneza nakala', e1: 'Angalau herufi 16', e2: 'Manenosiri hayalingani', ks: 'Nenosiri linalopendekezwa', ot: 'Lingine', h3: 'Nakala moja kwa kila mtu. Anapaswa kuliandika nenosiri kwenye karatasi, kamwe si kwenye dokezo: likipotea, haliwezi kurejeshwa.', fi: 'Hujifunga kwa ✕, ukifunga simu, ukibadili programu, ukitikisa simu au baada ya sekunde 30 bila kuguswa. Nenosiri kwenye karatasi, si kwenye dokezo.', nc: 'Faili hii haiunganishi na chochote wala haitumi data.',
      h1: 'Tengeneza nakala kwa mtu mwingine. Itakuwa na nenosiri lake lenyewe na itakuwa tofauti na yako. Mwambie nenosiri ana kwa ana, kamwe si kwa ujumbe.',
      h2: 'Nakala iko tayari. Ipitishe kwa Bluetooth, kadi ya kumbukumbu au kebo.', sd: 'Tuma', sv: 'Hifadhi', ok: 'Imekamilika',
      hp: 'Kufungua: andika nenosiri kwenye Tafuta kisha bonyeza Enter. Hujifunga kwa ✕, ukifunga simu, ukibadili programu, ukitikisa simu au baada ya sekunde 30 bila kuguswa.',
      lg: 'Lugha', cl: 'Lugha katika nakala', cc: 'Lugha ya madokezo', e3: 'Chagua angalau lugha moja', ca: 'Chagua zote', cn: 'Ondoa zote'
    }
  },
  hne: {
    nm: 'छत्तीसगढ़ी',
    dir: 'ltr',
    c: { t: 'नोट्स', s: 'खोजें', e: 'कोई नोट नहीं है', z: 'कोई परिणाम नहीं मिला', n: 'नया नोट', d: 'हटाएँ', b: 'वापस', p: 'यहाँ लिखें…', f: 'नोट्स' },
    r: {
      bk: 'वापस', pv: 'पिछला', nx: 'अगला', f: 'अक्षरों का आकार', th: 'थीम', cp: 'एक प्रति दें', ab: 'जानकारी', x: 'बंद करें', s: 'खोजें', m: 'और', z: 'कोई परिणाम नहीं मिला',
      k1: 'नया पासवर्ड', k2: 'पासवर्ड दोबारा लिखें', fn: 'फ़ाइल का नाम', mk: 'प्रति बनाएँ', e1: 'कम से कम 16 अक्षर', e2: 'दोनों पासवर्ड एक जैसे नहीं हैं', ks: 'सुझाया गया पासवर्ड', ot: 'दूसरा', h3: 'हर व्यक्ति के लिए अलग प्रति। वह पासवर्ड काग़ज़ पर लिखे, किसी नोट में नहीं: खो जाने पर वापस नहीं मिल सकता।', fi: '✕ दबाने, फ़ोन लॉक करने, ऐप बदलने, फ़ोन हिलाने या 30 सेकंड तक न छूने पर यह बंद हो जाता है। पासवर्ड काग़ज़ पर रखें, नोट में नहीं।', nc: 'यह फ़ाइल कहीं नहीं जुड़ती और कोई डेटा नहीं भेजती।',
      h1: 'किसी और के लिए एक प्रति बनाएँ। उसका अपना पासवर्ड होगा और वह आपकी प्रति से अलग होगी। पासवर्ड आमने-सामने बताएँ, संदेश में न भेजें।',
      h2: 'प्रति तैयार है। इसे ब्लूटूथ, मेमोरी कार्ड या केबल से दें।', sd: 'भेजें', sv: 'सहेजें', ok: 'हो गया',
      hp: 'खोलने के लिए: पासवर्ड खोज बॉक्स में लिखें और Enter दबाएँ। ✕ दबाने, फ़ोन लॉक करने, ऐप बदलने, फ़ोन हिलाने या 30 सेकंड तक न छूने पर यह बंद हो जाता है।',
      lg: 'भाषा', cl: 'प्रति में भाषाएँ', cc: 'नोट्स की भाषा', e3: 'कम से कम एक भाषा चुनें', ca: 'सब चुनव', cn: 'सब हटाव'
    }
  },
  om: {
    nm: 'Afaan Oromoo',
    dir: 'ltr',
    c: { t: 'Yaadannoo', s: 'Barbaadi', e: 'Yaadannoon hin jiru', z: 'Bu’aan hin argamne', n: 'Yaadannoo haaraa', d: 'Haqi', b: 'Duubatti', p: 'As barreessi…', f: 'yaadannoo' },
    r: {
      bk: 'Duubatti', pv: 'Kan duraa', nx: 'Kan itti aanu', f: 'Guddina qubee', th: 'Bifa', cp: 'Garagalcha kenni', ab: 'Waa’ee', x: 'Cufi', s: 'Barbaadi', m: 'Dabalata', z: 'Bu’aan hin argamne',
      k1: 'Jecha icciitii haaraa', k2: 'Jecha icciitii irra deebi’i', fn: 'Maqaa faayilii', mk: 'Garagalcha uumi', e1: 'Yoo xiqqaate qubee 16', e2: 'Jechoonni icciitii wal hin simne', ks: 'Jecha icciitii yaada kenname', ot: 'Kan biraa', h3: 'Nama tokkoof garagalcha tokko. Jecha icciitii waraqaa irratti haa barreessu, yaadannoo keessatti miti: yoo bade, deebi’ee hin argamu.', fi: '✕n, bilbila cufuun, app jijjiiruun, bilbila raasuun ykn sekondii 30 osoo hin tuqin cufama. Jecha icciitii waraqaa irratti qabadhu, yaadannoo keessatti miti.', nc: 'Faayiliin kun waan tokkoon illee hin walqabatu, odeeffannoos hin ergu.',
      h1: 'Nama biraaf garagalcha uumi. Jecha icciitii mataa isaa qaba, kan keetiin adda. Jecha icciitii fuula fuulatti itti himi, ergaadhaan gonkumaa.',
      h2: 'Garagalchi qophaa’eera. Bluetooth, kaardii ykn kebiliidhaan kenni.', sd: 'Ergi', sv: 'Olkaa’i', ok: 'Xumurameera',
      hp: 'Banuuf: jecha icciitii saanduqa barbaacha yaadannoo keessatti barreessii Enter tuqi. ✕n, bilbila cufuun, app jijjiiruun, bilbila raasuun ykn sekondii 30 osoo hin tuqin cufama.',
      lg: 'Afaan', cl: 'Afaanota garagalcha keessaa', cc: 'Afaan yaadannoo', e3: 'Yoo xiqqaate afaan tokko filadhu', ca: 'Hunda filadhu', cn: 'Hunda haqi'
    }
  },
  or: {
    nm: 'ଓଡ଼ିଆ',
    dir: 'ltr',
    c: { t: 'ନୋଟ୍', s: 'ଖୋଜନ୍ତୁ', e: 'କୌଣସି ନୋଟ୍ ନାହିଁ', z: 'କୌଣସି ଫଳାଫଳ ମିଳିଲା ନାହିଁ', n: 'ନୂଆ ନୋଟ୍', d: 'ବିଲୋପ କରନ୍ତୁ', b: 'ପଛକୁ', p: 'ଏଠାରେ ଲେଖନ୍ତୁ…', f: 'ନୋଟ୍' },
    r: {
      bk: 'ପଛକୁ', pv: 'ପୂର୍ବବର୍ତ୍ତୀ', nx: 'ପରବର୍ତ୍ତୀ', f: 'ଅକ୍ଷର ଆକାର', th: 'ଥିମ୍', cp: 'ଏକ କପି ଦିଅନ୍ତୁ', ab: 'ବିଷୟରେ', x: 'ବନ୍ଦ କରନ୍ତୁ', s: 'ଖୋଜନ୍ତୁ', m: 'ଅଧିକ', z: 'କୌଣସି ଫଳାଫଳ ମିଳିଲା ନାହିଁ',
      k1: 'ନୂଆ ପାସୱାର୍ଡ', k2: 'ପାସୱାର୍ଡ ପୁଣି ଲେଖନ୍ତୁ', fn: 'ଫାଇଲ୍ ନାମ', mk: 'କପି ତିଆରି କରନ୍ତୁ', e1: 'ଅତି କମରେ 16ଟି ଅକ୍ଷର', e2: 'ଦୁଇଟି ପାସୱାର୍ଡ ମେଳ ଖାଉନାହିଁ', ks: 'ପ୍ରସ୍ତାବିତ ପାସୱାର୍ଡ', ot: 'ଅନ୍ୟ ଏକ', h3: 'ପ୍ରତ୍ୟେକ ବ୍ୟକ୍ତି ପାଇଁ ଅଲଗା କପି। ସେ ପାସୱାର୍ଡ କାଗଜରେ ଲେଖନ୍ତୁ, କୌଣସି ନୋଟ୍‌ରେ ନୁହେଁ: ହଜିଗଲେ ଫେରି ପାଇହେବ ନାହିଁ।', fi: '✕ ଦବାଇଲେ, ଫୋନ୍ ଲକ୍ କଲେ, ଆପ୍ ବଦଳାଇଲେ, ଫୋନ୍ ହଲାଇଲେ କିମ୍ବା 30 ସେକେଣ୍ଡ ନ ଛୁଇଁଲେ ଏହା ବନ୍ଦ ହୋଇଯାଏ। ପାସୱାର୍ଡ କାଗଜରେ ରଖନ୍ତୁ, କୌଣସି ନୋଟ୍‌ରେ ନୁହେଁ।', nc: 'ଏହି ଫାଇଲ୍ କୌଣସି ସହିତ ଯୋଡ଼ି ହୁଏ ନାହିଁ ଏବଂ କୌଣସି ତଥ୍ୟ ପଠାଏ ନାହିଁ।',
      h1: 'ଅନ୍ୟ ଜଣଙ୍କ ପାଇଁ ଏକ କପି ତିଆରି କରନ୍ତୁ। ଏହାର ନିଜସ୍ୱ ପାସୱାର୍ଡ ରହିବ ଏବଂ ଆପଣଙ୍କ କପିଠାରୁ ଅଲଗା ହେବ। ପାସୱାର୍ଡ ମୁହାଁମୁହିଁ କୁହନ୍ତୁ, ମେସେଜରେ କେବେ ନୁହେଁ।',
      h2: 'କପି ପ୍ରସ୍ତୁତ। ବ୍ଲୁଟୁଥ୍, ମେମୋରୀ କାର୍ଡ କିମ୍ବା କେବଲ୍ ଦ୍ୱାରା ଦିଅନ୍ତୁ।', sd: 'ପଠାନ୍ତୁ', sv: 'ସଞ୍ଚୟ କରନ୍ତୁ', ok: 'ହୋଇଗଲା',
      hp: 'ଖୋଲିବାକୁ: ନୋଟ୍ ଖୋଜା ବାକ୍ସରେ ପାସୱାର୍ଡ ଲେଖି Enter ଦବାନ୍ତୁ। ✕ ଦବାଇଲେ, ଫୋନ୍ ଲକ୍ କଲେ, ଆପ୍ ବଦଳାଇଲେ, ଫୋନ୍ ହଲାଇଲେ କିମ୍ବା 30 ସେକେଣ୍ଡ ନ ଛୁଇଁଲେ ଏହା ବନ୍ଦ ହୋଇଯାଏ।',
      lg: 'ଭାଷା', cl: 'କପିରେ ଥିବା ଭାଷା', cc: 'ନୋଟ୍‌ର ଭାଷା', e3: 'ଅତି କମରେ ଗୋଟିଏ ଭାଷା ବାଛନ୍ତୁ', ca: 'ସମସ୍ତ ବାଛନ୍ତୁ', cn: 'ସମସ୍ତ ହଟାନ୍ତୁ'
    }
  },
  az: {
    nm: 'Azərbaycan',
    dir: 'ltr',
    c: { t: 'Qeydlər', s: 'Axtar', e: 'Hələ qeyd yoxdur', z: 'Nəticə yoxdur', n: 'Yeni qeyd', d: 'Sil', b: 'Geri', p: 'Buraya yazın…', f: 'qeydler' },
    r: {
      bk: 'Geri', pv: 'Əvvəlki', nx: 'Növbəti', f: 'Mətn ölçüsü', th: 'Görünüş', cp: 'Nüsxə ötür',
      ab: 'Haqqında', x: 'Bağla', s: 'Axtar', m: 'Daha çox', z: 'Nəticə yoxdur', k1: 'Yeni şifrə',
      k2: 'Şifrəni təkrarlayın', fn: 'Fayl adı', mk: 'Nüsxə yarat', e1: 'Ən azı 16 simvol', e2: 'Şifrələr uyğun gəlmir', ks: 'Təklif olunan şifrə',
      ot: 'Başqası', h3: 'Hər adama bir nüsxə. Şifrəni heç vaxt qeyddə deyil, kağıza yazmalıdırlar: itsə, bərpa edilə bilməz.', fi: '✕ ilə, telefonu kilidləyəndə, tətbiqi dəyişəndə, silkələyəndə və ya 30 saniyə toxunulmayanda bağlanır. Şifrə kağızda, heç vaxt qeyddə deyil.', nc: 'Bu fayl heç nəyə qoşulmur və heç bir məlumat göndərmir.', h1: 'Başqa biri üçün nüsxə yaradın. Onun öz şifrəsi olur və sizinkindən fərqlidir. Şifrəni mesajla deyil, şəxsən deyin.', h2: 'Nüsxə hazırdır. Bluetooth, kart və ya kabel ilə ötürün.',
      sd: 'Göndər', sv: 'Yadda saxla', ok: 'Hazırdır', hp: 'Açmaq üçün: şifrəni Axtar xanasına yazın və Enter basın. ✕ ilə, telefonu kilidləyəndə, tətbiqi dəyişəndə, silkələyəndə və ya 30 saniyə toxunulmayanda bağlanır.', lg: 'Dil', cl: 'Nüsxədəki dillər',
      cc: 'Qeydlərin dili', e3: 'Ən azı bir dil seçin', ca: 'Hamısını seç', cn: 'Hamısını təmizlə'
    }
  },
  ne: {
    nm: 'नेपाली',
    dir: 'ltr',
    c: { t: 'नोटहरू', s: 'खोज्नुहोस्', e: 'अझै कुनै नोट छैन', z: 'कुनै नतिजा फेला परेन', n: 'नयाँ नोट', d: 'मेटाउनुहोस्', b: 'पछाडि', p: 'यहाँ लेख्नुहोस्…', f: 'notes' },
    r: {
      bk: 'पछाडि', pv: 'अघिल्लो', nx: 'अर्को', f: 'अक्षरको आकार', th: 'थिम', cp: 'प्रतिलिपि पठाउनुहोस्',
      ab: 'बारेमा', x: 'बन्द गर्नुहोस्', s: 'खोज्नुहोस्', m: 'थप', z: 'कुनै नतिजा फेला परेन', k1: 'नयाँ पासवर्ड',
      k2: 'पासवर्ड फेरि लेख्नुहोस्', fn: 'फाइलको नाम', mk: 'प्रतिलिपि बनाउनुहोस्', e1: 'कम्तीमा 16 अक्षर', e2: 'पासवर्ड मिलेन', ks: 'सुझाइएको पासवर्ड',
      ot: 'अर्को', h3: 'प्रति व्यक्ति एक प्रतिलिपि। पासवर्ड नोटमा कहिल्यै नलेखी कागजमा लेख्नुपर्छ: हराएमा यो फिर्ता ल्याउन सकिँदैन।', fi: '✕ थिच्दा, फोन लक गर्दा, एप बदल्दा, फोन हल्लाउँदा वा 30 सेकेन्ड नछुँदा यो बन्द हुन्छ। पासवर्ड नोटमा कहिल्यै नराखी कागजमा राख्नुहोस्।', nc: 'यो फाइल कुनै कुरामा जोडिँदैन र कुनै डेटा पठाउँदैन।', h1: 'अरू कसैका लागि प्रतिलिपि बनाउनुहोस्। यसको आफ्नै पासवर्ड हुन्छ र तपाईंकोभन्दा फरक हुन्छ। पासवर्ड म्यासेजमा होइन, भेटेरै भन्नुहोस्।', h2: 'प्रतिलिपि तयार छ। Bluetooth, कार्ड वा केबलबाट पठाउनुहोस्।',
      sd: 'पठाउनुहोस्', sv: 'सेभ गर्नुहोस्', ok: 'सम्पन्न', hp: 'खोल्न: नोट खोज बाकसमा पासवर्ड टाइप गरी Enter थिच्नुहोस्। ✕ थिच्दा, फोन लक गर्दा, एप बदल्दा, फोन हल्लाउँदा वा 30 सेकेन्ड नछुँदा यो बन्द हुन्छ।', lg: 'भाषा', cl: 'प्रतिलिपिमा भएका भाषाहरू',
      cc: 'नोटहरूको भाषा', e3: 'कम्तीमा एउटा भाषा छान्नुहोस्', ca: 'सबै छान्नुहोस्', cn: 'सबै हटाउनुहोस्'
    }
  },
  ta: {
    nm: 'தமிழ்',
    dir: 'ltr',
    c: { t: 'குறிப்புகள்', s: 'தேடு', e: 'குறிப்புகள் இல்லை', z: 'முடிவுகள் இல்லை', n: 'புதிய குறிப்பு', d: 'நீக்கு', b: 'பின்', p: 'இங்கே எழுதுங்கள்…', f: 'குறிப்புகள்' },
    r: {
      bk: 'பின்', pv: 'முந்தையது', nx: 'அடுத்தது', f: 'எழுத்து அளவு', th: 'தீம்', cp: 'நகலை வழங்கு',
      ab: 'பற்றி', x: 'மூடு', s: 'தேடு', m: 'மேலும்', z: 'முடிவுகள் இல்லை', k1: 'புதிய கடவுச்சொல்',
      k2: 'கடவுச்சொல்லை மீண்டும் உள்ளிடவும்', fn: 'கோப்பின் பெயர்', mk: 'நகலை உருவாக்கு', e1: 'குறைந்தது 16 எழுத்துகள்', e2: 'கடவுச்சொற்கள் பொருந்தவில்லை', ks: 'பரிந்துரைக்கப்பட்ட கடவுச்சொல்',
      ot: 'வேறொன்று', h3: 'ஒவ்வொருவருக்கும் ஒரு நகல். கடவுச்சொல்லை அவர் காகிதத்தில் எழுதி வைக்க வேண்டும், குறிப்பில் ஒருபோதும் வேண்டாம்: தொலைந்தால் மீட்க முடியாது.', fi: '✕ அழுத்தினால், தொலைபேசியைப் பூட்டினால், செயலியை மாற்றினால், தொலைபேசியை அசைத்தால் அல்லது 30 வினாடி தொடாவிட்டால் மூடிவிடும். கடவுச்சொல்லை காகிதத்தில் வைத்திருங்கள், குறிப்பில் ஒருபோதும் வேண்டாம்.', nc: 'இந்தக் கோப்பு எதனுடனும் இணைவதில்லை, தரவையும் அனுப்புவதில்லை.', h1: 'வேறொருவருக்கு நகலை உருவாக்குங்கள். அதற்கு தனிக் கடவுச்சொல் இருக்கும்; அது உங்களுடையதிலிருந்து வேறுபட்டிருக்கும். கடவுச்சொல்லை நேரில் சொல்லுங்கள், செய்தியில் ஒருபோதும் வேண்டாம்.', h2: 'நகல் தயார். புளூடூத், கார்டு அல்லது கேபிள் மூலம் கொடுங்கள்.',
      sd: 'அனுப்பு', sv: 'சேமி', ok: 'முடிந்தது', hp: 'திறக்க: குறிப்புகளின் தேடல் பெட்டியில் கடவுச்சொல்லை எழுதி Enter அழுத்தவும். ✕ அழுத்தினால், தொலைபேசியைப் பூட்டினால், செயலியை மாற்றினால், தொலைபேசியை அசைத்தால் அல்லது 30 வினாடி தொடாவிட்டால் மூடிவிடும்.', lg: 'மொழி', cl: 'நகலில் உள்ள மொழிகள்',
      cc: 'குறிப்புகளின் மொழி', e3: 'குறைந்தது ஒரு மொழியைத் தேர்ந்தெடுக்கவும்', ca: 'அனைத்தையும் தேர்ந்தெடு', cn: 'தேர்வை நீக்கு'
    }
  },
  te: {
    nm: 'తెలుగు',
    dir: 'ltr',
    c: { t: 'గమనికలు', s: 'వెతకండి', e: 'ఇంకా గమనికలు లేవు', z: 'ఫలితాలు లేవు', n: 'కొత్త గమనిక', d: 'తొలగించు', b: 'వెనుకకు', p: 'ఇక్కడ రాయండి…', f: 'గమనికలు' },
    r: {
      bk: 'వెనుకకు', pv: 'మునుపటి', nx: 'తదుపరి', f: 'అక్షర పరిమాణం', th: 'రూపం', cp: 'కాపీని పంచుకోండి',
      ab: 'గురించి', x: 'మూసివేయి', s: 'వెతకండి', m: 'మరిన్ని', z: 'ఫలితాలు లేవు', k1: 'కొత్త పాస్‌వర్డ్',
      k2: 'పాస్‌వర్డ్‌ను మళ్లీ నమోదు చేయండి', fn: 'ఫైల్ పేరు', mk: 'కాపీని తయారు చేయండి', e1: 'కనీసం 16 అక్షరాలు', e2: 'పాస్‌వర్డ్‌లు సరిపోలడం లేదు', ks: 'సూచించిన పాస్‌వర్డ్',
      ot: 'మరొకటి', h3: 'ప్రతి వ్యక్తికి ఒక కాపీ మాత్రమే. వారు పాస్‌వర్డ్‌ను కాగితంపై రాయాలి, గమనికలో ఎప్పుడూ రాయకూడదు: అది పోతే, తిరిగి పొందడం సాధ్యం కాదు.', fi: '✕ నొక్కినా, ఫోన్ లాక్ చేసినా, యాప్ మార్చినా, ఫోన్ ఊపినా లేదా 30 సెకన్లు తాకకపోయినా ఇది మూసుకుంటుంది. పాస్‌వర్డ్‌ను కాగితంపై భద్రపరచండి, గమనికలో ఎప్పుడూ రాయకండి.', nc: 'ఈ ఫైల్ దేనికీ కనెక్ట్ అవదు, ఎలాంటి డేటానూ పంపదు.', h1: 'వేరొకరి కోసం ఒక కాపీని తయారు చేయండి. దానికి ప్రత్యేకమైన పాస్‌వర్డ్ ఉంటుంది, అది మీ పాస్‌వర్డ్‌కు భిన్నంగా ఉంటుంది. ఆ పాస్‌వర్డ్‌ను వారికి స్వయంగా కలసి చెప్పండి, సందేశంలో ఎప్పుడూ పంపవద్దు.', h2: 'కాపీ సిద్ధంగా ఉంది. Bluetooth, కార్డ్ లేదా కేబుల్ ద్వారా పంపండి.',
      sd: 'పంపండి', sv: 'సేవ్ చేయండి', ok: 'పూర్తయింది', hp: 'తెరవడానికి: గమనికల శోధన పెట్టెలో పాస్‌వర్డ్‌ను టైప్ చేసి Enter నొక్కండి. ✕ నొక్కినా, ఫోన్ లాక్ చేసినా, యాప్ మార్చినా, ఫోన్ ఊపినా లేదా 30 సెకన్లు తాకకపోయినా ఇది మూసుకుంటుంది.', lg: 'భాష', cl: 'కాపీలోని భాషలు',
      cc: 'గమనికల భాష', e3: 'కనీసం ఒక భాషను ఎంచుకోండి', ca: 'అన్నీ ఎంచుకోండి', cn: 'అన్ని ఎంపికలను తీసివేయండి'
    }
  },
  kn: {
    nm: 'ಕನ್ನಡ',
    dir: 'ltr',
    c: { t: 'ಟಿಪ್ಪಣಿಗಳು', s: 'ಹುಡುಕಿ', e: 'ಇನ್ನೂ ಯಾವುದೇ ಟಿಪ್ಪಣಿಗಳಿಲ್ಲ', z: 'ಯಾವುದೇ ಫಲಿತಾಂಶಗಳಿಲ್ಲ', n: 'ಹೊಸ ಟಿಪ್ಪಣಿ', d: 'ಅಳಿಸಿ', b: 'ಹಿಂದಕ್ಕೆ', p: 'ಇಲ್ಲಿ ಬರೆಯಿರಿ…', f: 'tippanigalu' },
    r: {
      bk: 'ಹಿಂದಕ್ಕೆ', pv: 'ಹಿಂದಿನದು', nx: 'ಮುಂದಿನದು', f: 'ಅಕ್ಷರದ ಗಾತ್ರ', th: 'ಥೀಮ್', cp: 'ಪ್ರತಿಯನ್ನು ನೀಡಿ',
      ab: 'ಕುರಿತು', x: 'ಮುಚ್ಚಿ', s: 'ಹುಡುಕಿ', m: 'ಇನ್ನಷ್ಟು', z: 'ಯಾವುದೇ ಫಲಿತಾಂಶಗಳಿಲ್ಲ', k1: 'ಹೊಸ ಪಾಸ್‌ವರ್ಡ್',
      k2: 'ಪಾಸ್‌ವರ್ಡ್ ಮತ್ತೆ ನಮೂದಿಸಿ', fn: 'ಫೈಲ್ ಹೆಸರು', mk: 'ಪ್ರತಿ ಮಾಡಿ', e1: 'ಕನಿಷ್ಠ 16 ಅಕ್ಷರಗಳು', e2: 'ಪಾಸ್‌ವರ್ಡ್‌ಗಳು ಹೊಂದಿಕೆಯಾಗುತ್ತಿಲ್ಲ', ks: 'ಸೂಚಿಸಿದ ಪಾಸ್‌ವರ್ಡ್',
      ot: 'ಮತ್ತೊಂದು', h3: 'ಪ್ರತಿಯೊಬ್ಬರಿಗೂ ಒಂದು ಪ್ರತಿ. ಪಾಸ್‌ವರ್ಡ್ ಅನ್ನು ಟಿಪ್ಪಣಿಯಲ್ಲಿ ಎಂದಿಗೂ ಬರೆಯದೆ ಕಾಗದದಲ್ಲಿ ಬರೆಯಬೇಕು: ಕಳೆದುಹೋದರೆ ಅದನ್ನು ಮರಳಿ ಪಡೆಯಲಾಗುವುದಿಲ್ಲ.', fi: '✕ ಒತ್ತಿದರೆ, ಫೋನ್ ಲಾಕ್ ಮಾಡಿದರೆ, ಆ್ಯಪ್ ಬದಲಾಯಿಸಿದರೆ, ಫೋನ್ ಅಲುಗಾಡಿಸಿದರೆ ಅಥವಾ 30 ಸೆಕೆಂಡು ಮುಟ್ಟದಿದ್ದರೆ ಇದು ಮುಚ್ಚುತ್ತದೆ. ಪಾಸ್‌ವರ್ಡ್ ಅನ್ನು ಟಿಪ್ಪಣಿಯಲ್ಲಿ ಅಲ್ಲದೆ ಕಾಗದದಲ್ಲಿ ಇಡಿ.', nc: 'ಈ ಫೈಲ್ ಯಾವುದಕ್ಕೂ ಸಂಪರ್ಕಿಸುವುದಿಲ್ಲ ಮತ್ತು ಯಾವುದೇ ಡೇಟಾವನ್ನು ಕಳುಹಿಸುವುದಿಲ್ಲ.', h1: 'ಬೇರೆಯವರಿಗಾಗಿ ಒಂದು ಪ್ರತಿ ಮಾಡಿ. ಅದಕ್ಕೆ ತನ್ನದೇ ಆದ ಪಾಸ್‌ವರ್ಡ್ ಇರುತ್ತದೆ ಮತ್ತು ನಿಮ್ಮದಕ್ಕಿಂತ ಭಿನ್ನವಾಗಿರುತ್ತದೆ. ಪಾಸ್‌ವರ್ಡ್ ಅನ್ನು ಸಂದೇಶದಲ್ಲಿ ಅಲ್ಲ, ಖುದ್ದಾಗಿ ಹೇಳಿ.', h2: 'ಪ್ರತಿ ಸಿದ್ಧವಾಗಿದೆ. Bluetooth, ಕಾರ್ಡ್ ಅಥವಾ ಕೇಬಲ್ ಮೂಲಕ ನೀಡಿ.',
      sd: 'ಕಳುಹಿಸಿ', sv: 'ಉಳಿಸಿ', ok: 'ಮುಗಿದಿದೆ', hp: 'ತೆರೆಯಲು: ಟಿಪ್ಪಣಿಗಳ ಹುಡುಕಾಟ ಬಾಕ್ಸ್‌ನಲ್ಲಿ ಪಾಸ್‌ವರ್ಡ್ ಟೈಪ್ ಮಾಡಿ Enter ಒತ್ತಿರಿ. ✕ ಒತ್ತಿದರೆ, ಫೋನ್ ಲಾಕ್ ಮಾಡಿದರೆ, ಆ್ಯಪ್ ಬದಲಾಯಿಸಿದರೆ, ಫೋನ್ ಅಲುಗಾಡಿಸಿದರೆ ಅಥವಾ 30 ಸೆಕೆಂಡು ಮುಟ್ಟದಿದ್ದರೆ ಇದು ಮುಚ್ಚುತ್ತದೆ.', lg: 'ಭಾಷೆ', cl: 'ಪ್ರತಿಯಲ್ಲಿರುವ ಭಾಷೆಗಳು',
      cc: 'ಟಿಪ್ಪಣಿಗಳ ಭಾಷೆ', e3: 'ಕನಿಷ್ಠ ಒಂದು ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ', ca: 'ಎಲ್ಲವನ್ನೂ ಆಯ್ಕೆಮಾಡಿ', cn: 'ಎಲ್ಲವನ್ನೂ ತೆರವುಗೊಳಿಸಿ'
    }
  },
  am: {
    nm: 'አማርኛ',
    dir: 'ltr',
    c: { t: 'ማስታወሻዎች', s: 'ፈልግ', e: 'እስካሁን ምንም ማስታወሻ የለም', z: 'ምንም ውጤት የለም', n: 'አዲስ ማስታወሻ', d: 'ሰርዝ', b: 'ተመለስ', p: 'እዚህ ይጻፉ…', f: 'ማስታወሻዎች' },
    r: {
      bk: 'ተመለስ', pv: 'ያለፈው', nx: 'ቀጣይ', f: 'የጽሑፍ መጠን', th: 'ገጽታ', cp: 'ቅጂ አጋራ',
      ab: 'ስለ', x: 'ዝጋ', s: 'ፈልግ', m: 'ተጨማሪ', z: 'ምንም ውጤት የለም', k1: 'አዲስ የይለፍ ቃል',
      k2: 'የይለፍ ቃሉን እንደገና ያስገቡ', fn: 'የፋይል ስም', mk: 'ቅጂ ፍጠር', e1: 'ቢያንስ 16 ቁምፊዎች', e2: 'የይለፍ ቃሎቹ አይዛመዱም', ks: 'የተጠቆመ የይለፍ ቃል',
      ot: 'ሌላ', h3: 'ለእያንዳንዱ ሰው አንድ ቅጂ። የይለፍ ቃሉን በወረቀት ላይ መጻፍ አለባቸው፣ በማስታወሻ ውስጥ ፈጽሞ መጻፍ የለባቸውም፤ ከጠፋ መልሶ ማግኘት አይቻልም።', fi: 'በ✕፣ ስልኩን ሲቆልፉ፣ መተግበሪያ ሲቀይሩ፣ ስልኩን ሲያናውጡ ወይም ለ30 ሰከንድ ካልነኩት ይዘጋል። የይለፍ ቃሉን በወረቀት ላይ ያስቀምጡ፣ በማስታወሻ ውስጥ ፈጽሞ አይጻፉት።', nc: 'ይህ ፋይል ከምንም ጋር አይገናኝም፣ ምንም ዓይነት ውሂብም አይልክም።', h1: 'ለሌላ ሰው ቅጂ ይፍጠሩ። የራሱ የይለፍ ቃል ይኖረዋል፣ ከእርስዎም ይለያል። የይለፍ ቃሉን በአካል ተገናኝተው ይንገሯቸው፣ በመልዕክት ፈጽሞ አይላኩት።', h2: 'ቅጂው ዝግጁ ነው። Bluetooth፣ ካርድ ወይም ገመድ በመጠቀም ያስተላልፉት።',
      sd: 'ላክ', sv: 'አስቀምጥ', ok: 'ተጠናቋል', hp: 'ለመክፈት: የይለፍ ቃሉን በማስታወሻዎች ፍለጋ ሳጥን ውስጥ ይጻፉና Enter ይጫኑ። በ✕፣ ስልኩን ሲቆልፉ፣ መተግበሪያ ሲቀይሩ፣ ስልኩን ሲያናውጡ ወይም ለ30 ሰከንድ ካልነኩት ይዘጋል።', lg: 'ቋንቋ', cl: 'በቅጂው ውስጥ ያሉ ቋንቋዎች',
      cc: 'የማስታወሻዎች ቋንቋ', e3: 'ቢያንስ አንድ ቋንቋ ይምረጡ', ca: 'ሁሉንም ምረጥ', cn: 'ሁሉንም ምርጫዎች አጽዳ'
    }
  },
  tk: {
    nm: 'Türkmen',
    dir: 'ltr',
    c: { t: 'Bellikler', s: 'Gözle', e: 'Heniz bellik ýok', z: 'Netije ýok', n: 'Täze bellik', d: 'Poz', b: 'Yza', p: 'Şu ýere ýazyň…', f: 'bellikler' },
    r: {
      bk: 'Yza', pv: 'Öňki', nx: 'Indiki', f: 'Harp ölçegi', th: 'Tema', cp: 'Nusga ber',
      ab: 'Barada', x: 'Ýap', s: 'Gözle', m: 'Has köp', z: 'Netije ýok', k1: 'Täze parol',
      k2: 'Paroly gaýtalaň', fn: 'Faýlyň ady', mk: 'Nusga döret', e1: 'Iň az 16 belgi', e2: 'Parollar gabat gelmeýär', ks: 'Teklip edilýän parol',
      ot: 'Başga', h3: 'Her adama bir nusga. Parolyny kagyza ýazsyn, hiç haçan bellige däl: ýitirse, dikeltmek mümkin däl.', fi: '✕ bilen, telefony gulplanyňyzda, programmany çalşanyňyzda, telefony silkeläniňizde ýa-da 30 sekunt degilmese ýapylýar. Parol kagyzda, hiç haçan bellikde däl.', nc: 'Bu faýl hiç zada birigenok we maglumat ibermeýär.', h1: 'Başga adam üçin nusga dörediň. Onuň öz paroly bolar we siziňkiden tapawutly bolar. Paroly göni aýdyň, hiç haçan habarda däl.', h2: 'Nusga taýýar. Ony Bluetooth, kart ýa-da kabel arkaly geçiriň.',
      sd: 'Iber', sv: 'Ýatda sakla', ok: 'Taýýar', hp: 'Açmak üçin: paroly «Gözle» gutusyna ýazyp Enter basyň. ✕ bilen, telefony gulplanyňyzda, programmany çalşanyňyzda, telefony silkeläniňizde ýa-da 30 sekunt degilmese ýapylýar.', lg: 'Dil', cl: 'Nusgadaky diller',
      cc: 'Belliklerin dili', e3: 'Iň az bir dil saýlaň', ca: 'Hemmesini saýla', cn: 'Saýlawy ýok et'
    }
  },
  uz: {
    nm: 'Oʻzbek',
    dir: 'ltr',
    c: { t: 'Qaydlar', s: 'Qidirish', e: 'Hali qaydlar yoʻq', z: 'Natija topilmadi', n: 'Yangi qayd', d: 'Oʻchirish', b: 'Orqaga', p: 'Shu yerga yozing…', f: 'qaydlar' },
    r: {
      bk: 'Orqaga', pv: 'Oldingi', nx: 'Keyingi', f: 'Matn oʻlchami', th: 'Mavzu', cp: 'Nusxa uzatish',
      ab: 'Haqida', x: 'Yopish', s: 'Qidirish', m: 'Yana', z: 'Natija topilmadi', k1: 'Yangi parol',
      k2: 'Parolni qaytaring', fn: 'Fayl nomi', mk: 'Nusxa yaratish', e1: 'Kamida 16 ta belgi', e2: 'Parollar mos kelmadi', ks: 'Tavsiya etilgan parol',
      ot: 'Boshqasi', h3: 'Har bir kishiga bitta nusxa. Parolni hech qachon qaydda emas, qogʻozga yozish kerak: yoʻqolsa, uni tiklab boʻlmaydi.', fi: '✕ bilan, telefonni qulflaganda, ilovani almashtirganda, silkitganda yoki 30 soniya tegilmasa yopiladi. Parol qogʻozda, hech qachon qaydda emas.', nc: 'Bu fayl hech narsaga ulanmaydi va hech qanday maʼlumot yubormaydi.', h1: 'Boshqa birov uchun nusxa yarating. Uning oʻz paroli boʻladi va siznikidan farq qiladi. Parolni xabarda emas, shaxsan ayting.', h2: 'Nusxa tayyor. Bluetooth, karta yoki kabel orqali uzating.',
      sd: 'Yuborish', sv: 'Saqlash', ok: 'Tayyor', hp: 'Ochish uchun: parolni «Qidirish» maydoniga yozing va Enter bosing. ✕ bilan, telefonni qulflaganda, ilovani almashtirganda, silkitganda yoki 30 soniya tegilmasa yopiladi.', lg: 'Til', cl: 'Nusxadagi tillar',
      cc: 'Qaydlar tili', e3: 'Kamida bitta tilni tanlang', ca: 'Barchasini tanlash', cn: 'Barchasini tozalash'
    }
  },
  tg: {
    nm: 'Тоҷикӣ',
    dir: 'ltr',
    c: { t: 'Ёддоштҳо', s: 'Ҷустуҷӯ', e: 'Ҳоло ягон ёддошт нест', z: 'Натиҷае нест', n: 'Ёддошти нав', d: 'Нест кардан', b: 'Бозгашт', p: 'Ин ҷо нависед…', f: 'ёддоштҳо' },
    r: {
      bk: 'Бозгашт', pv: 'Қаблӣ', nx: 'Навбатӣ', f: 'Андозаи матн', th: 'Мавзӯъ', cp: 'Нусхаро гузаштан',
      ab: 'Дар бораи', x: 'Пӯшидан', s: 'Ҷустуҷӯ', m: 'Бештар', z: 'Натиҷае нест', k1: 'Пароли нав',
      k2: 'Паролро такрор кунед', fn: 'Номи файл', mk: 'Нусха сохтан', e1: 'Ҳадди ақал 16 аломат', e2: 'Паролҳо мувофиқат намекунанд', ks: 'Пароли пешниҳодшуда',
      ot: 'Дигар', h3: 'Як нусха барои ҳар шахс. Онҳо бояд паролро дар коғаз нависанд, ҳеҷ гоҳ дар ёддошт не: агар гум шавад, барқарор кардан ғайриимкон аст.', fi: 'Бо ✕, қулф кардани телефон, иваз кардани барнома, ҷунбондани телефон ё пас аз 30 сония бе ламс пӯшида мешавад. Парол дар коғаз, ҳеҷ гоҳ дар ёддошт не.', nc: 'Ин файл ба ҳеҷ чиз пайваст намешавад ва ягон маълумот намефиристад.', h1: 'Барои каси дигар нусха созед. Он пароли худро мегирад ва аз шумо фарқ мекунад. Паролро шахсан гӯед, ҳеҷ гоҳ дар паём не.', h2: 'Нусха тайёр. Бо Bluetooth, корт ё кабел гузаронед.',
      sd: 'Фиристодан', sv: 'Захира кардан', ok: 'Тайёр', hp: 'Барои кушодан: паролро дар «Ҷустуҷӯ» нависед ва Enter-ро пахш кунед. Бо ✕, қулф кардани телефон, иваз кардани барнома, ҷунбондани телефон ё пас аз 30 сония бе ламс пӯшида мешавад.', lg: 'Забон', cl: 'Забонҳо дар нусха',
      cc: 'Забони ёддоштҳо', e3: 'Ҳадди ақал як забонро интихоб кунед', ca: 'Ҳамаро интихоб кардан', cn: 'Ҳамаро тоза кардан'
    }
  },
  ms: {
    nm: 'Bahasa Melayu',
    dir: 'ltr',
    c: { t: 'Nota', s: 'Cari', e: 'Belum ada nota', z: 'Tiada hasil', n: 'Nota baharu', d: 'Padam', b: 'Kembali', p: 'Tulis di sini…', f: 'nota' },
    r: {
      bk: 'Kembali', pv: 'Sebelumnya', nx: 'Seterusnya', f: 'Saiz teks', th: 'Tema', cp: 'Beri salinan',
      ab: 'Perihal', x: 'Tutup', s: 'Cari', m: 'Lagi', z: 'Tiada hasil', k1: 'Kata laluan baharu',
      k2: 'Ulang kata laluan', fn: 'Nama fail', mk: 'Buat salinan', e1: 'Sekurang-kurangnya 16 aksara', e2: 'Kata laluan tidak sepadan', ks: 'Kata laluan yang dicadangkan',
      ot: 'Lain', h3: 'Satu salinan untuk setiap orang. Hendaklah dia menulis kata laluan di atas kertas, jangan sekali-kali dalam nota: jika hilang, tidak dapat dipulihkan.', fi: 'Ia tertutup dengan ✕, apabila telefon dikunci, aplikasi ditukar, telefon digoncang, atau selepas 30 saat tanpa sentuhan. Kata laluan di atas kertas, bukan dalam nota.', nc: 'Fail ini tidak bersambung ke mana-mana dan tidak menghantar data.', h1: 'Buat salinan untuk orang lain. Ia mempunyai kata laluan sendiri dan berbeza daripada milik anda. Beritahu kata laluan secara bersemuka, jangan sekali-kali melalui mesej.', h2: 'Salinan sedia. Berikan melalui Bluetooth, kad atau kabel.',
      sd: 'Hantar', sv: 'Simpan', ok: 'Selesai', hp: 'Untuk membuka: taip kata laluan dalam Cari dan tekan Enter. Ia tertutup dengan ✕, apabila telefon dikunci, aplikasi ditukar, telefon digoncang, atau selepas 30 saat tanpa sentuhan.', lg: 'Bahasa', cl: 'Bahasa dalam salinan',
      cc: 'Bahasa nota', e3: 'Pilih sekurang-kurangnya satu bahasa', ca: 'Pilih semua', cn: 'Kosongkan semua'
    }
  }
};
