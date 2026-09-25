import { json } from '@sveltejs/kit';
import { INITIAL_NOTICES } from '$lib/stores/gameStore';

export function GET() {
	const instagramNotices = INITIAL_NOTICES.filter((n) => n.sourceType === 'instagram' || n.instagramHandle);
	
	const decanatos = instagramNotices.filter((n) => n.category === 'Decanatos');
	const juniorEnterprises = instagramNotices.filter((n) => n.category === 'Empresas Juniores');

	return json({
		success: true,
		source: 'Instagram UnB & FGA Official Accounts',
		timestamp: new Date().toISOString(),
		total: instagramNotices.length,
		officialAccounts: {
			decanatos: [
				{ name: 'Decanato de Assuntos Comunitários (DAC / DDS)', handle: '@dds.dac.unb', url: 'https://www.instagram.com/dds.dac.unb/' },
				{ name: 'Decanato de Extensão (DEX UnB)', handle: '@extensaounb', url: 'https://www.instagram.com/extensaounb/' },
				{ name: 'Decanato de Pesquisa e Inovação (DPI UnB)', handle: '@dpi.unb', url: 'https://www.instagram.com/dpi.unb/' },
				{ name: 'Diretoria do Restaurante Universitário (RU / DAC)', handle: '@ru.unb_oficial', url: 'https://www.instagram.com/ru.unb_oficial/' },
				{ name: 'Diretoria de Atenção à Saúde (DASU / DAC)', handle: '@dasu_unb', url: 'https://www.instagram.com/dasu_unb/' },
				{ name: 'Decanato de Ensino de Graduação / SAA (UnB Oficial)', handle: '@unb_oficial', url: 'https://www.instagram.com/unb_oficial/' }
			],
			juniorEnterprises: [
				{ name: "Orc'estra Gamificação (Engenharia de Software FGA)", handle: '@orcestragamificacao', url: 'https://www.instagram.com/orcestragamificacao/' },
				{ name: 'EletronJun (Engenharia Eletrônica FGA)', handle: '@eletronjun', url: 'https://www.instagram.com/eletronjun/' },
				{ name: 'Zenit Aerospace (Engenharia Aeroespacial FGA)', handle: '@zenitaerospace', url: 'https://www.instagram.com/zenitaerospace/' },
				{ name: 'Matriz Energia (Engenharia de Energia FGA)', handle: '@matrizenergia', url: 'https://www.instagram.com/matrizenergia/' },
				{ name: 'Mecajun (Engenharia Mecatrônica & Automotiva UnB)', handle: '@mecajun', url: 'https://www.instagram.com/mecajun/' },
				{ name: 'CJR (Empresa Júnior de Computação UnB)', handle: '@cjr.unb', url: 'https://www.instagram.com/cjr.unb/' },
				{ name: 'Concentro DF (Federação das Empresas Juniores do DF)', handle: '@concentrodf', url: 'https://www.instagram.com/concentrodf/' }
			]
		},
		posts: {
			decanatos,
			juniorEnterprises,
			all: instagramNotices
		}
	});
}
