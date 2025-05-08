package com.bolsadeideas.springboot.backend.apirest.models.services;


import com.bolsadeideas.springboot.backend.apirest.models.dao.RolDao;
import com.bolsadeideas.springboot.backend.apirest.models.entity.RolEntity;
import com.bolsadeideas.springboot.backend.apirest.models.services.intefaces.IRolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RolServiceImpl implements IRolService {

    @Autowired private RolDao irolDao;

    @Override
    public void sava(RolEntity rolEntity) {
        this.irolDao.save(rolEntity);
    }

    @Override
    public RolEntity get(Long id) {
        return this.irolDao.findById(id).get();
    }
}
