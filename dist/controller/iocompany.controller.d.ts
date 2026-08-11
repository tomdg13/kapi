import { IoCompanyService } from 'src/service/iocompany.service';
import { CreateIocompanyDto, UpdateIocompanyDto, IocompanyDto, CompanyStatsDto, UpdateCompanyLogoDto, AdvancedSearchCompanyDto } from 'src/dto/iocompany.dto';
export declare class IoCompanyController {
    private readonly ioCompanyService;
    constructor(ioCompanyService: IoCompanyService);
    findCompanyById(id: number): Promise<any>;
    findCompanysByStatus(query: IocompanyDto): Promise<any>;
    advancedSearchCompanies(query: AdvancedSearchCompanyDto): Promise<any>;
    getCompanyStats(query: CompanyStatsDto): Promise<any>;
    createCompany(createCompanyDto: CreateIocompanyDto): Promise<{
        status: string;
        message: string;
        data?: any;
    }>;
    updateCompany(id: number, updateCompanyDto: UpdateIocompanyDto): Promise<{
        status: string;
        message: string;
        data?: any;
    }>;
    updateCompanyLogo(id: number, logoDto: UpdateCompanyLogoDto): Promise<{
        status: string;
        message: string;
        data?: any;
    }>;
    deleteCompany(id: number): Promise<{
        status: string;
        message: string;
    }>;
}
